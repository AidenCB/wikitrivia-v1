import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { Item } from "../../types/item";

const deck: Item[] = readFileSync("public/items.json", "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));
for (const [id, title] of [
  ["Q124988", "Punic Wars"],
  ["Q115564437", "ChatGPT"],
]) {
  const savedCard = deck.find((card) => card.id === id)!;

  test(`the saved ${title} card renders and flips`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/items.json", (route) =>
      route.fulfill({
        contentType: "text/plain",
        body: (id === "Q115564437"
          ? [...deck.filter((card) => card.id !== id), savedCard]
          : [savedCard, ...deck.filter((card) => card.id !== id)]
        )
          .map((card) => JSON.stringify(card))
          .join("\n"),
      })
    );
    await page.addInitScript((modern) => {
      Math.random = () => (modern ? 0.999999 : 0);
      localStorage.clear();
    }, id === "Q115564437");
    await page.goto("./");
    await page.getByRole("button", { name: "Start game" }).click();
    const card = page.locator(`[data-rbd-draggable-id="${id}"]`);
    await expect(card).toBeVisible();
    await card.click();
    await expect(card).toHaveClass(/flipped/);
    expect(errors).toEqual([]);
  });
}
