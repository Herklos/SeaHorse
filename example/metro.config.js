const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Watch monorepo packages
config.watchFolders = [workspaceRoot];

// Resolve modules from workspace root first
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Support package exports
config.resolver.unstable_conditionNames = ["import", "default", "require"];

// Packages that must share a single module instance — pnpm resolves peer deps
// per-package so the library gets its own copy in packages/seahorse/node_modules,
// which Metro finds first for files inside that tree. Using resolveRequest to
// hard-redirect these to the app's copy beats extraNodeModules (which is a
// fallback that doesn't override an already-found resolution).
const singletons = [
  "react",
  "react-native",
  "react-native-reanimated",
  "react-native-gesture-handler",
  "@gorhom/bottom-sheet",
];

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = originalResolveRequest ?? context.resolveRequest;

  // Singleton redirect — force these packages to always resolve from the app's
  // node_modules, not from packages/seahorse/node_modules. Metro's own resolver
  // is used (so react-native/platform extensions still work) with originModulePath
  // overridden to a file inside projectRoot so the directory walk starts there.
  const isSingleton = singletons.some(
    (s) => moduleName === s || moduleName.startsWith(s + "/")
  );
  if (isSingleton) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(projectRoot, "_sentinel.js") },
      moduleName,
      platform
    );
  }

  // NativeWind v5 preview dropped jsx-runtime shims; expo-router still imports them.
  // Redirect to React's own runtime — NW's transform is Babel-level, not runtime.
  if (moduleName === "nativewind/jsx-runtime") {
    return resolve(context, "react/jsx-runtime", platform);
  }
  if (moduleName === "nativewind/jsx-dev-runtime") {
    return resolve(context, "react/jsx-dev-runtime", platform);
  }

  // react-native-css/components uses cssInterop which fails on web (Object.entries
  // on an undefined RNView). On web, NativeWind handles className via real CSS classes,
  // so the cssInterop wrapper is not needed — redirect to react-native directly.
  if (platform === "web" && moduleName === "react-native-css/components") {
    return resolve(context, "react-native", platform);
  }

  // Fix @babel/runtime ESM crash on web
  if (
    platform === "web" &&
    moduleName.startsWith("@babel/runtime/helpers/esm/")
  ) {
    return resolve(
      context,
      moduleName.replace("@babel/runtime/helpers/esm/", "@babel/runtime/helpers/"),
      platform,
    );
  }

  return resolve(context, moduleName, platform);
};

module.exports = withNativewind(config);
