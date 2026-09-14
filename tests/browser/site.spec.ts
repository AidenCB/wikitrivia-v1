import { expect, test } from "@playwright/test";

test("loads the saved deck and heart images from the site's base path", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const deckResponse = page.waitForResponse((response) =>
    response.url().endsWith("/items.json")
  );
  await page.goto("./");
  expect((await deckResponse).ok()).toBe(true);
  await expect(page.getByText("An independent fork of")).toBeVisible();
  await page.getByRole("button", { name: "Start game" }).click();
  await expect(
    page.locator('[data-rbd-droppable-id="next"] [data-rbd-draggable-id]')
  ).toHaveCount(1);
  const hearts = page.getByAltText("Remaining life");
  await expect(hearts).toHaveCount(3);
  await expect
    .poll(() =>
      hearts.evaluateAll((elements) =>
        elements.every(
          (image) =>
            image instanceof HTMLImageElement &&
            image.complete &&
            image.naturalWidth > 0
        )
      )
    )
    .toBe(true);
  expect(errors).toEqual([]);
});
