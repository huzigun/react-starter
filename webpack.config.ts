import path from "path";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const isDevelopment = process.env.NODE_ENV !== "production";

const config: webpack.Configuration = {
  name: "smsparty",
  mode: isDevelopment ? "development" : "production",
  // devtool: isDevelopment ? 'hidden-source-map' : 'eval',
  // devtool: isDevelopment ? 'hidden-source-map' : 'cheap-module-source-map',
  devtool: isDevelopment ? "hidden-source-map" : false,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@hooks": path.resolve(__dirname, "hooks"),
      "@components": path.resolve(__dirname, "components"),
      "@layouts": path.resolve(__dirname, "layouts"),
      "@pages": path.resolve(__dirname, "pages"),
      "@utils": path.resolve(__dirname, "utils"),
      "@typings": path.resolve(__dirname, "typings"),
      "@assets": path.resolve(__dirname, "assets"),
    },
  },
  entry: {
    app: "./client",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { browsers: ["last 2 chrome versions"] },
                debug: isDevelopment,
              },
            ],
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
          env: {
            development: {
              plugins: [require.resolve("react-refresh/babel")],
            },
          },
        },
        exclude: path.join(__dirname, "node_modules"),
      },
      {
        test: /\.(sa|sc|c)ss?$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4000,
              name: "images/[name].[ext]",
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDevelopment ? "development" : "production",
      API_URL: isDevelopment
        ? "http://localhost:3000/api/admin"
        : "https://api.smsparty.co.kr/api/admin",
    }),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/dist/",
  },
  devServer: {
    historyApiFallback: true, // react router
    port: 9705,
    publicPath: "/dist/",
    // proxy: {
    //   '/api/': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   },
    // },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  // config.plugins.push(
  //   new BundleAnalyzerPlugin({ analyzerMode: "server", openAnalyzer: false })
  // );
}
if (!isDevelopment && config.plugins) {
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "static" }));
}

export default config;
