import { expect, test, Page } from "@playwright/test";
import { Item } from "../../types/item";

const cards: Item[] = Array.from({ length: 12 }, (_, index) => ({
  id: `Qtest${index}`,
  label: `Test card ${index}`,
  year: 100 + index * 200,
  description: "Historical event",
  instance_of: ["event"],
  date_prop_id: "P571",
  image: "Test.jpg",
  occupations: null,
  num_sitelinks: 10,
  page_views: 100,
  wikipedia_title: "History",
}));

async function placeIncorrectly(page: Page) {
  const next = page.locator(
    '[data-rbd-droppable-id="next"] [data-rbd-draggable-id]'
  );
  await next.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowDown");
  // Keyboard moves animate before accepting another arrow key.
  await page.waitForTimeout(300);
  for (let move = 0; move < 5; move++) {
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(60);
  }
  await page.keyboard.press("Space");
}

test("finish, restart, flip a card, and play the next round without errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /Invariant failed|Cannot update a component/.test(message.text())
    ) {
      errors.push(message.text());
    }
  });
  await page.route("**/items.json", (route) =>
    route.fulfill({
      body: cards.map((card) => JSON.stringify(card)).join("\n"),
      contentType: "text/plain",
    })
  );
  await page.route("https://commons.wikimedia.org/**", (route) =>
    route.fulfill({
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
      contentType: "image/svg+xml",
    })
  );
  await page.addInitScript(() => {
    Math.random = () => 0;
    localStorage.clear();
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Start game" }).click();

  for (let round = 0; round < 2; round++) {
    for (let turn = 0; turn < 3; turn++) {
      await placeIncorrectly(page);
      if (turn < 2) {
        await expect(
          page.locator(
            '[data-rbd-droppable-id="played"] [data-rbd-drag-handle-draggable-id]'
          )
        ).toHaveCount(0);
        await expect(
          page.locator(
            '[data-rbd-droppable-id="played"] [data-rbd-draggable-id]'
          )
        ).toHaveCount(turn + 2);
      }
    }
    // Restart as soon as the button appears, including on the final correction.
    await page.getByRole("button", { name: "Play again" }).click();
    const played = page.locator(
      '[data-rbd-droppable-id="played"] [data-rbd-draggable-id]'
    );
    await expect(played).toHaveCount(1);
    await played.click();
    await expect(played).toHaveClass(/flipped/);
    await page
      .locator('[data-rbd-droppable-id="next"] [data-rbd-draggable-id]')
      .click();
  }
  await placeIncorrectly(page);
  await expect(
    page.locator('[data-rbd-droppable-id="played"] [data-rbd-draggable-id]')
  ).toHaveCount(2);
  expect(errors).toEqual([]);
});
