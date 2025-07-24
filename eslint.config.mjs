import {defineConfig} from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

import js from "@eslint/js";

export default defineConfig([
    {files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: {js}, extends: ["js/recommended"]},
    {files: ["src/client/**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: {globals: globals.browser}},
    {files: ["src/server/**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: {globals: globals.node}},
    tseslint.configs.recommended,
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": [
                "error",
                {groups: [["^\\u0000"], ["^node:"], ["^\\w+"], ["^api:"], ["^client:"], ["^server:"]]},
            ],
            "simple-import-sort/exports": "error",
        },
    },
    eslintConfigPrettier,
]);
