# wikitrivia-v1

The older version of **Wikitrivia**, with bug fixes and GitHub Pages support.

This is an independent fork of [Wikitrivia by Tom Watson](https://github.com/tom-james-watson/wikitrivia), based on [the last V1 revision, `b398872`](https://github.com/tom-james-watson/wikitrivia/commit/b398872bcd231a8ead09fca39a8cbf3968894d6c), before the V2 redesign. It preserves V1's interface and timeline game. It is not the official Wikitrivia project.

Drag cards onto the timeline in chronological order. Three wrong placements end the game. Click a played card to read more and open its Wikipedia article.

## Changes in this fork

- Fixed drag errors when a game ends and another game starts.
- Finish the final card correction before showing **Play again**.
- Stop correction animations when their drag ends or the board unmounts.
- Fixed a crash in browsers without vibration support, including WebKit.
- Fixed cards such as Punic Wars crashing when category metadata is missing.
- Added support for GitHub Pages project URLs, including deck and heart image paths.
- Share links point to the hosted fork.
- Added browser tests for completing games, restarting, flipping cards, and playing again.

For related projects and earlier forks, see [the comparison notes](docs/related-forks.md).

## Run locally

Install [Bun](https://bun.com/docs/installation) and Node.js 22. The project pins Bun in `package.json` and uses `bun.lock`.

```bash
bun install --frozen-lockfile
bun run dev
```

Open <http://localhost:3000>.

## Build and preview

```bash
bun run build
bun run start
```

The build writes the static website to `out/`. The preview server prints its local address. No application server or API credentials are needed to host the exported site.

## Host on GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Open **Actions → Deploy GitHub Pages → Run workflow**.
4. Select the `main` branch and run the workflow.
5. Open the website URL shown by the deployment after it finishes.

For this repository, the default URL is <https://aidencb.github.io/wikitrivia-v1/>. It becomes available after the first successful deployment. The workflow runs manually, so repeat step 3 when you want to publish new changes.

The workflow gets the site's path from GitHub Pages and uploads only `out/`. Source files, tests, dependencies, and local recordings are not included in the website artifact. If you set up a custom domain in **Settings → Pages**, run the workflow again to rebuild for that address.

Public repositories can use Pages on GitHub Free. The website is public. See [GitHub's Pages setup documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Check changes

```bash
bun run lint
bun run format
bun run playwright install chromium webkit
bun run test
bun run build
```

`lint` checks TypeScript and ESLint. The browser tests use Chromium and WebKit with a mobile viewport. Tests load a fixed deck to make the restart sequence repeatable. Run tests and builds sequentially because both use Next.js's `.next/` directory.

## Card data

`public/items.json` is V1's saved deck, with one JSON object per line. It is a historical snapshot and does not refresh from Wikidata automatically. The app excludes entries listed in `lib/bad-cards.ts` and filters obvious date clues.

Facts come from [Wikidata](https://www.wikidata.org), articles from [Wikipedia](https://www.wikipedia.org), and card images load from Wikimedia Commons. Individual images retain their own licenses. The original data collection project is [wikitrivia-scraper](https://github.com/tom-james-watson/wikitrivia-scraper).

Report bugs in this fork in [this repository's issues](https://github.com/AidenCB/wikitrivia-v1/issues). Include the card's title or Wikidata ID when reporting incorrect data.

## License and attribution

The original code is copyright © 2022 Thomas James Watson and is licensed under the MIT License. This fork retains the original [LICENSE.md](LICENSE.md) and upstream commit history. The game also credits the original project on its start screen.
