const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      main: "./source/js/script.js",
    },
    output: {
      filename: "js/[name].min.js",
      path: path.resolve(__dirname, "build"),
      publicPath: "/",
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
    devServer: {
      static: {
        directory: path.join(__dirname, "build"),
      },
      compress: true,
      port: 9000,
      hot: true,
      open: true,
      devMiddleware: {
        writeToDisk: true,
      },
      watchFiles: ["source/**/*"],
    },
    module: {
      rules: [
        // Pug
        {
          test: /\.pug$/,
          use: ["pug-loader"]
        },
        // SCSS → CSS
        {
          test: /\.(scss|sass|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "../" // Важно для правильных путей к картинкам в CSS
              }
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                url: true // Разрешаем обработку url() в CSS
              }
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    require("autoprefixer")({ grid: true })
                  ]
                },
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                implementation: require("sass") // Используем Dart Sass
              }
            }
          ]
        },
        // JS (Babel)
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        },
        // Шрифты
        {
          test: /\.(woff|woff2)$/,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name][ext]"
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./source/index.pug",
        filename: "index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "css/style.min.css",
        chunkFilename: "css/[id].css"
      })
    ],
    optimization: {
      minimizer: [
        `...`, // Используем стандартные минификаторы Webpack
        new (require("css-minimizer-webpack-plugin"))() // Минификация CSS
      ]
    }
  };
};
