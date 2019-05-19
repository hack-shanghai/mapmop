var merge = require("webpack-merge");

module.exports = {
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options =>
        merge(options, {
          transformAssetUrls: {
            source: "src",
            img: "src",
            image: "xlink:href",
            "vl-style-icon": "src"
          }
        })
      );
  }
};
