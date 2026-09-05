import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This app fetches data client-side (catalog filters, admin tables,
      // realtime dashboard) and uses the standard "mounted" flag to avoid
      // SSR/localStorage hydration mismatches — both are calling setState
      // from inside a useEffect body by design, which is the long-standing
      // idiomatic pattern for effects, not a bug. The new React Compiler
      // oriented rule flags every such call as an error; keep it visible as
      // a warning instead of forcing this codebase away from a correct and
      // widely used pattern.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
