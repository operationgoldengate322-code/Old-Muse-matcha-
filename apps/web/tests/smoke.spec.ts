import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Old Muse Matcha delivers ritual-grade matcha/i,
    })
  ).toBeVisible();
});
