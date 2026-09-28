"use client";
import { useEffect, useState } from "react";
import { request, Notice } from "./ui";
import { Brand } from "./brand";
type Row = Record<string, unknown>;
export function AdminConsole() {
  const [data, setData] = useState<
    Record<string, { rows: Row[]; count: number }>
  >({});
  const [tab, setTab] = useState("profiles");
  const [message, setMessage] = useState("");
  const load = () =>
    request<typeof data>("/api/admin")
      .then(setData)
      .catch((e) => setMessage(e.message));
  useEffect(() => {
    load();
  }, []);
  async function action(action: string, id: string, extra: Row = {}) {
    try {
      await request("/api/admin", "POST", { action, id, ...extra });
      setMessage("Action saved and audited.");
      await load();
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <>
      <Brand />
      <h1 style={{ marginTop: 35 }}>
        Rewear <em>studio.</em>
      </h1>
      <p className="page-intro">
        Operational data · newest 50 records per section. Private wardrobe
        photos are not exposed here.
      </p>
      <div className="toolbar">
        {Object.keys(data).map((k) => (
          <button
            key={k}
            className={`chip ${k === tab ? "active" : ""}`}
            onClick={() => setTab(k)}
          >
            {k.replaceAll("_", " ")} {data[k].count ?? ""}
          </button>
        ))}
      </div>
      <Notice message={message} />
      <div className="panel" style={{ overflowX: "auto" }}>
        {data[tab]?.rows.length ? (
          data[tab].rows.map((r, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid #eee", padding: "20px 0" }}
            >
              <pre
                style={{
                  fontSize: 11,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {JSON.stringify(r, null, 2)}
              </pre>
              <div className="toolbar">
                {tab === "profiles" && (
                  <>
                    <button
                      className="chip"
                      onClick={() =>
                        action(
                          r.suspended ? "unsuspend" : "suspend",
                          String(r.id),
                        )
                      }
                    >
                      {r.suspended ? "Unsuspend" : "Suspend"}
                    </button>
                    <button
                      className="chip"
                      onClick={() => action("grant", String(r.id), { days: 7 })}
                    >
                      Grant 7 days
                    </button>
                    <button
                      className="chip"
                      onClick={() => action("revoke", String(r.id))}
                    >
                      Remove admin grant
                    </button>
                  </>
                )}
                {tab === "shared_results" && (
                  <button
                    className="chip"
                    onClick={() => action("revoke_share", String(r.id))}
                  >
                    Revoke share
                  </button>
                )}
                {tab === "subscriptions" && (
                  <button
                    className="chip"
                    onClick={() =>
                      action("sync", String(r.provider_membership_id))
                    }
                  >
                    Sync Whop
                  </button>
                )}
                {tab === "feature_flags" && (
                  <button
                    className="chip"
                    onClick={() =>
                      action("flag", String(r.key), { enabled: !r.enabled })
                    }
                  >
                    {r.enabled ? "Disable" : "Enable"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No records yet.</p>
        )}
      </div>
      {tab === "app_settings" && (
        <form
          className="panel"
          style={{ marginTop: 20 }}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            action("pricing", "pricing", {
              monthly: Number(f.get("monthly")),
              annual: Number(f.get("annual")),
            });
          }}
        >
          <p>
            Update the display price only after updating both Whop plans.
            Checkout always uses Whop’s actual price.
          </p>
          <label className="field">
            Monthly USD
            <input required name="monthly" type="number" step="0.01" min="1" />
          </label>
          <label className="field">
            Annual USD
            <input required name="annual" type="number" step="0.01" min="1" />
          </label>
          <button className="button">Save displayed pricing</button>
        </form>
      )}
    </>
  );
}
