import postcssPresetEnv from "postcss-preset-env";
// import postcssP2v from "postcss-px-to-viewport";
export default opt => {
  const config = {
    plugins: () => [postcssPresetEnv()]
  };
  return config;
};
