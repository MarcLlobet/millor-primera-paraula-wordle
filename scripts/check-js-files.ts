import { glob } from "glob";

export const TEXT = {
  SEARCH_ERROR: "❌ Error while searching for JavaScript files: ",
  FILES_FOUND: "❌ Please, move the following .js files to Typescript:",
  SUCCESS: "✅ OK: No JavaScript files found.",
} as const;

export const searchCallback = (error: Error | null, files: string[]) => {
  if (error) {
    console.error(TEXT.SEARCH_ERROR, error);
    process.exit(1);
  }

  if (files.length) {
    console.error(TEXT.FILES_FOUND);
    console.group();
    files.forEach((file: string) => console.error(`- ${file}`));
    console.groupEnd();
    process.exit(1);
  }

  console.log(TEXT.SUCCESS);
};

export const checkJsFiles = (): void => {
  glob(
    "**/*.js",
    { ignore: ["node_modules/**", "coverage/**"] },
    searchCallback,
  );
};

export default checkJsFiles();
