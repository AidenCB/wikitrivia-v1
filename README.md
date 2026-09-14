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

Live site: <https://aidencb.github.io/wikitrivia-v1/>.

This repository publishes the built website from the `gh-pages` branch. The
source code stays on `main`. This setup uses normal repository push access and
does not require a custom Actions workflow or an extra `workflow` permission.

To publish an update from your local checkout:

```bash
bun install --frozen-lockfile
bun run lint
bun run pages:deploy
```

`pages:deploy` builds the site for `/wikitrivia-v1/`, then publishes only the
contents of `out/` to `gh-pages`. It adds `.nojekyll` so GitHub serves Next.js's
`_next/` assets correctly. Dependencies, tests, source files, and recordings stay
out of the published branch. GitHub Pages updates the live site after the push.

If you need to configure Pages again:

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **gh-pages** and **/ (root)**, then click **Save**.

The local build path matches this repository's name. If you rename the repository
or move it to a custom domain, update `pages:build` in `package.json` to use the
new path, or an empty path for a domain root, before publishing again.

Public repositories can use Pages on GitHub Free. The website is public. See
[GitHub's branch publishing documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

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
