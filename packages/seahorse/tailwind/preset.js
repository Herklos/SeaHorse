/**
 * Tailwind preset for @drakkar.software/expo-forge.
 *
 * Only provides structural tokens (borderRadius).
 * Colors are intentionally absent — define your own `primary` palette
 * in your app's tailwind.config.js to match your brand.
 *
 * @example
 * // tailwind.config.js
 * module.exports = {
 *   presets: [require("nativewind/preset"), require("@drakkar.software/seahorse/tailwind-preset")],
 *   theme: {
 *     extend: {
 *       colors: {
 *         primary: { 500: "#EC4899", 600: "#DB2777" }, // your brand
 *       },
 *     },
 *   },
 * };
 */
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
};
