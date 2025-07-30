import { type Page, expect } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/");
  await page.waitForURL("/auth/login");
  await page.waitForTimeout(3000);

  await page.getByRole("textbox", { name: "username" }).fill("admin");
  await page.getByRole("textbox", { name: "password" }).fill("123456");
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL("/");
  await expect(page.getByText("Recent Events")).toBeVisible();
}
