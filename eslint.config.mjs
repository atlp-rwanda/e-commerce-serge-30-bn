import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

export default [
  { languageOptions: { globals: globals.browser } },
  ...compat.extends("standard-with-typescript"),
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    root: true,
    extends: "airbnb-base",
    env: {
      node: true,
      es6: true,
      jest: true,
      browser: true
    },
    rules: {
      "one-var": 0,
      "one-var-declaration-per-line": 0,
      "new-cap": 0,
      "consistent-return": 0,
      "no-param-reassign": 0,
      "comma-dangle": 0,
      curly: ["error", "multi-line"],
      "import/no-unresolved": [2, { commonjs: true }],
      "no-shadow": ["error", { allow: ["req", "res", "err"] }],
      "valid-jsdoc": [
        "error",
        {
          requireReturn: true,
          requireReturnType: true,
          requireParamDescription: false,
          requireReturnDescription: true,
        },
      ],
      "require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
    },
  },
];
