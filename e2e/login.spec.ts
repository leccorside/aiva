import { test, expect } from "@playwright/test";

test("Usuário pode logar com credenciais válidas", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[type="email"]', "admin@mail.com");
  await page.fill('input[type="password"]', "admin123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("text=Seja Bem-Vindo")).toBeVisible();
});
