import ghPages from "gh-pages";

ghPages
  .publish("out", {
    nojekyll: true,
    // Clear inherited dotfiles as well as old assets, but preserve Git metadata.
    remove: ["**/*", ".*", ".*/**", "!.git/**"],
  })
  .then(() => console.log("Published to gh-pages."))
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
