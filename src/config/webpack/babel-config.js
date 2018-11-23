import babelEnv from "@babel/preset-env";
import transformRuntime from "@babel/plugin-transform-runtime";
import babelPluginSyntaxDynamicImport from "@babel/plugin-syntax-dynamic-import"; //动态import
import babelPluginTransformMoudlesCommonjs from "@babel/plugin-transform-modules-commonjs";

export default {
  babelrc: false,
  presets: [[babelEnv, { modules: false }]],
  plugins: [
    [transformRuntime],
    [babelPluginSyntaxDynamicImport],
    [babelPluginTransformMoudlesCommonjs]
  ]
};
