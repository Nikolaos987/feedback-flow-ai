import js from "@eslint/js";
import importPlugin from "eslint-plugin-import"; // import the plugin
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      import: importPlugin,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.app.json",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.app.json",
        },
      },
    },
    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js built-ins (fs, path)
            "external", // npm packages (react, axios)
            "internal", // Aliases (like @/components)
            ["parent", "sibling", "index"], // Relative imports
            "type", // Type-only imports
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
      "import/newline-after-import": "error",
    },
  },
  /** Disable rules for the core shadcn folder */
  {
    files: ["src/components/shadcn/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
      "import/order": "off",
    },
  },
]);
