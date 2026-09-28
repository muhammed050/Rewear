import { test, expect } from "@playwright/test";
test("landing is usable and primary CTA reaches upload", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "You already own the outfit." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("link", { name: "Recreate my look", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Upload outfit inspiration")).toBeAttached();
  await expect(
    page.getByRole("button", { name: "Recreate this look" }),
  ).toBeDisabled();
});
test("SEO public routes are valid and private routes noindex", async ({
  page,
  request,
}) => {
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
  await page.goto("/closet");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
test("pricing changes billing period honestly", async ({ page }) => {
  await page.goto("/pricing");
  await expect(
    page.getByText("$49.99 billed yearly", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Monthly", exact: true }).click();
  await expect(
    page.getByText("$7.99 billed monthly", { exact: false }),
  ).toBeVisible();
});
