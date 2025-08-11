import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Désactiver le warning pour les balises <img> car nous utilisons l'export statique
      // où next/image n'apporte pas d'avantages significatifs avec Cloudinary
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
