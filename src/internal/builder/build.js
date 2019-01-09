import { getConfig } from "../config/webpack/build";
import Webpack from "webpack";

export default async opt => {
  const config = getConfig(opt);

  return new Promise(resolve => {
    const compiler = Webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(
          stats.toString({
            chunks: false,
            children: false,
            modules: false,
            colors: true
          })
        );
      }
      console.log(
        stats.toString({
          chunks: false,
          children: false,
          modules: false,
          colors: true
        })
      );
      resolve();
    });
  });
};
