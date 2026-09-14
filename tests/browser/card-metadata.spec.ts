import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { Item } from "../../types/item";

const deck: Item[] = readFileSync("public/items.json", "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));
const punicWars = deck.find((card) => card.id === "Q124988")!;

test("the saved Punic Wars card renders and flips without category metadata", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/items.json", (route) =>
    route.fulfill({
      contentType: "text/plain",
      body: [punicWars, ...deck.filter((card) => card.id !== punicWars.id)]
        .map((card) => JSON.stringify(card))
        .join("\n"),
    })
  );
  await page.addInitScript(() => {
    Math.random = () => 0;
    localStorage.clear();
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Start game" }).click();
  const card = page.locator('[data-rbd-draggable-id="Q124988"]');
  await expect(card).toBeVisible();
  await card.click();
  await expect(card).toHaveClass(/flipped/);
  expect(errors).toEqual([]);
});
