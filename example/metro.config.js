const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
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

// Fix @babel/runtime ESM crash on web
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === "web" &&
    moduleName.startsWith("@babel/runtime/helpers/esm/")
  ) {
    const cjsName = moduleName.replace(
      "@babel/runtime/helpers/esm/",
      "@babel/runtime/helpers/",
    );
    return (originalResolveRequest ?? context.resolveRequest)(
      context,
      cjsName,
      platform,
    );
  }
  return (originalResolveRequest ?? context.resolveRequest)(
    context,
    moduleName,
    platform,
  );
};

module.exports = withNativeWind(config, { input: "./global.css" });
