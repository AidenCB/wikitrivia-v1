# Earlier forks and fixes

Checked September 14, 2026.

Others have already preserved the older game and fixed bugs. The closest match is [Wikitrivia Classic](https://github.com/michaelclarkcuadrado/wikitrivia-classic), created in May 2026. This repository does not claim to be the first V1 fork.

## Wikitrivia Classic

[michaelclarkcuadrado/wikitrivia-classic](https://github.com/michaelclarkcuadrado/wikitrivia-classic) explicitly keeps the original 2022 gameplay after the V2 update. Its README describes minimal site changes and a refreshed dataset, and links to a [playable site](https://wikitrivia.michaelcc.me).

At the time of this check, its default branch had 11 additional commits based directly on the final V1 revision, `b398872`. See the [comparison with V1](https://github.com/tom-james-watson/wikitrivia/compare/b398872bcd231a8ead09fca39a8cbf3968894d6c...michaelclarkcuadrado:master).

Relevant changes include:

- [Updated dependencies and replaced react-beautiful-dnd with @hello-pangea/dnd](https://github.com/michaelclarkcuadrado/wikitrivia-classic/commit/ea924a0c5f8da6f0b67be2c5006dd7494aa164b8). This also changes board state updates and disables the next card during correction.
- [Changed correction animation timing and disabled interaction with pending cards](https://github.com/michaelclarkcuadrado/wikitrivia-classic/commit/378d8701d5d694e9975bd81c10e90a8a56d2bda4).
- [Fixed dragging while unfocused and added missing-image backgrounds](https://github.com/michaelclarkcuadrado/wikitrivia-classic/commit/9b8da76fd6a9eee5ae6f378a222b1015c7ebc408).

## Earlier V1 fixes in other forks

These projects contain relevant earlier work, although their linked changes do not establish an ongoing V1 maintenance effort.

| Fork | Documented change |
| --- | --- |
| [rowboat1/wikitrivia](https://github.com/rowboat1/wikitrivia) | [PR #124](https://github.com/tom-james-watson/wikitrivia/pull/124), from July 2024, fixes a `str.charAt` crash when a card's long description triggers a label lookup from an empty `instance_of` array. Upstream closed the PR without merging it. |
| [philharper/personal-trivia](https://github.com/philharper/personal-trivia) | [PR #105](https://github.com/tom-james-watson/wikitrivia/pull/105), from December 2023, adds variable heart counts and duplicate-card prevention for a customized small deck. Upstream closed the PR without merging it. |

## Search scope

The check used GitHub repository searches for `wikitrivia-v1`, `wikitrivia V1 fork:true`, and `wikitrivia legacy fork:true`. It also inspected the [upstream fork list](https://github.com/tom-james-watson/wikitrivia/forks) and [pull request history](https://github.com/tom-james-watson/wikitrivia/pulls?q=is%3Apr).

These findings verify prior projects and specific changes. They are not an exhaustive list of forks, and the linked applications were not tested as part of this search.
