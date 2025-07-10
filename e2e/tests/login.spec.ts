import { test, expect } from "@playwright/test";
import { login } from "./utils";

test("login with wrong credentials", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/auth/login");
  await page.waitForTimeout(3000);

  await page.getByRole("textbox", { name: "username" }).fill("wrong");
  await page.getByRole("textbox", { name: "password" }).fill("wrong");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Invalid username or password")).toBeVisible();
});

test("login with correct credentials", async ({ page }) => {
  await login(page);
});
