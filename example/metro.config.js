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

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = originalResolveRequest ?? context.resolveRequest;

  // NativeWind v5 preview dropped jsx-runtime shims; expo-router still imports them.
  // Redirect to React's own runtime — NW's transform is Babel-level, not runtime.
  if (moduleName === "nativewind/jsx-runtime") {
    return resolve(context, "react/jsx-runtime", platform);
  }
  if (moduleName === "nativewind/jsx-dev-runtime") {
    return resolve(context, "react/jsx-dev-runtime", platform);
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
