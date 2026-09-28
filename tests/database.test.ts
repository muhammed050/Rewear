import test from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
test("migrations enforce tenant isolation, privileged fields, quotas and billing idempotency", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit int,allowed_mime_types text[]);create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;create function storage.foldername(name text) returns text[] language sql as $$select string_to_array(name,'/')$$;create function public.gen_random_bytes(n int) returns bytea language sql as $$select substring(decode(replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-',''),'hex') from 1 for n)$$;grant usage on schema public,auth,storage to anon,authenticated,service_role;alter default privileges in schema public grant all on tables to anon,authenticated,service_role;`,
    );
    const migration = (
      await readFile("supabase/migrations/001_rewear.sql", "utf8")
    ).replace("create extension if not exists pgcrypto;", "");
    await db.exec(migration);
    const a = "11111111-1111-4111-8111-111111111111",
      b = "22222222-2222-4222-8222-222222222222";
    await db.query("insert into auth.users(id) values($1),($2)", [a, b]);
    await db.query(
      "insert into closet_items(user_id,name,category,primary_color) values($1,'A coat','coats','brown'),($2,'B shoes','shoes','black')",
      [a, b],
    );
    await db.exec(`set role authenticated;set request.jwt.claim.sub='${a}';`);
    const own = await db.query<{ name: string }>(
      "select name from closet_items",
    );
    assert.deepEqual(
      own.rows.map((r) => r.name),
      ["A coat"],
    );
    await assert.rejects(() =>
      db.query("update profiles set suspended=false where id=$1", [a]),
    );
    await assert.rejects(() =>
      db.query(
        "insert into entitlements(user_id,key,source,status) values($1,'rewear_plus','fake','active')",
        [a],
      ),
    );
    await assert.rejects(() =>
      db.query("select consume_usage('x','ai','month',500)"),
    );
    await db.exec(`reset role;set role anon;`);
    assert.equal((await db.query("select * from closet_items")).rows.length, 0);
    await db.exec("reset role");
    assert.equal(
      (
        await db.query<{ consume_usage: boolean }>(
          "select consume_usage('x','ai','month',1)",
        )
      ).rows[0].consume_usage,
      true,
    );
    assert.equal(
      (
        await db.query<{ consume_usage: boolean }>(
          "select consume_usage('x','ai','month',1)",
        )
      ).rows[0].consume_usage,
      false,
    );
    const args = [
      "event-1",
      "membership.activated",
      "hash",
      a,
      "mem_1",
      "plan_1",
      "monthly",
      "active",
      true,
      "2099-01-01",
      false,
      "2026-09-28",
    ];
    const sql =
      "select apply_membership($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)";
    assert.equal(
      (await db.query<{ apply_membership: boolean }>(sql, args)).rows[0]
        .apply_membership,
      true,
    );
    assert.equal(
      (await db.query<{ apply_membership: boolean }>(sql, args)).rows[0]
        .apply_membership,
      false,
    );
    assert.equal(
      (await db.query("select * from subscriptions")).rows.length,
      1,
    );
    assert.equal((await db.query("select * from entitlements")).rows.length, 1);
    await db.query(sql, [
      "event-old",
      "membership.deactivated",
      "hash",
      a,
      "mem_1",
      "plan_1",
      "monthly",
      "expired",
      false,
      "2026-01-01",
      false,
      "2026-09-01",
    ]);
    assert.equal(
      (await db.query<{ status: string }>("select status from subscriptions"))
        .rows[0].status,
      "active",
    );
  } finally {
    await db.close();
  }
});
