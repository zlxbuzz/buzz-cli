import postcssPresetEnv from "postcss-preset-env";
import postcssP2v from "postcss-px-to-viewport";
export default opt => {
  const config = {
    plugins: () =>
      [
        postcssPresetEnv({
          browsers: ["last 20 versions", "IE 9", "iOS >= 8"]
        })
      ].concat(
        opt.mobile && opt.mobile.viewport
          ? postcssP2v({
              viewportWidth: 750
            })
          : []
      )
  };
  return config;
};
