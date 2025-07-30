import { expect, test } from "@playwright/test";
import { login } from "./utils";

test("write note", async ({ page }) => {
  await login(page);
  await page
    .getByRole("listitem")
    .filter({ hasText: "New Note" })
    .getByRole("button")
    .click();
  await page.getByRole("heading", { name: "Create Note" }).click();
  await expect(
    page.getByRole("button", { name: "Generate Note" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Writing Command or Web Link" })
    .click();
  await page
    .getByRole("textbox", { name: "Writing Command or Web Link" })
    .fill(
      "Write a short story about an elephant in the style of Aesop's fables",
    );
  await page.getByRole("button", { name: "Generate Note" }).click();
  await page.waitForURL("/note/*");
  await expect(
    page.getByRole("heading", { name: "AI Processing" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI Processing" })).toBeHidden(
    { timeout: 20000 },
  );
  await expect(page.getByPlaceholder("Title")).toContainText(/Elephant/i);
  await page
    .getByRole("main")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .nth(2)
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await page.waitForURL("/quick-access/recycle-bin");
  await expect(
    page.getByLabel("breadcrumb").getByText("Recycle Bin"),
  ).toBeVisible();
});
