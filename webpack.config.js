const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      main: [
        './source/js/script.js',
        ...glob.sync('./source/img/icon-*.svg') // Автоматический импорт иконок
      ],
      styles: './source/sass/style.scss'
    },
    output: {
      filename: 'js/[name].min.js',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      clean: true,
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'build'),
      },
      compress: true,
      port: 9000,
      hot: true,
      open: true,
      devMiddleware: {
        writeToDisk: true,
      },
      watchFiles: ['source/**/*'],
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: true,
                self: true
              }
            }
          ],
        },
        {
          test: /\.(scss|sass|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer')({ grid: true })
                  ],
                  sourceMap: true
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                api: 'modern',
                warnRuleAsWarning: false,
                implementation: require('sass'),
                sourceMap: true,
                sassOptions: {
                  style: isProduction ? 'compressed' : 'expanded',
                  quietDeps: true,
                  verbose: false
                }
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext]',
          },
        },
        // Правило для SVG иконок (icon-*.svg)
        {
          test: /icon-.*\.svg$/,
          include: path.resolve(__dirname, 'source/img'),
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true,
                spriteFilename: 'sprite.svg',
                publicPath: '/img/',
                symbolId: filePath => {
                  const name = path.basename(filePath, '.svg');
                  return name.replace('icon-', '');
                }
              }
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  { name: 'removeViewBox', active: false },
                  { name: 'removeDimensions', active: true },
                  { name: 'removeTitle', active: true },
                  { name: 'removeUselessDefs', active: true }
                ]
              }
            }
          ]
        },
        // Правило для остальных SVG (не иконок)
        {
          test: /\.svg$/,
          exclude: /icon-.*\.svg$/,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext]'
          }
        },
        {
          test: /\.(woff|woff2)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.(ico)$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: 'source/fonts',
            to: 'fonts',
          },
          {
            from: 'source/favicon.ico',
            to: 'favicon.ico',
          },
          {
            from: 'source/img',
            to: 'img',
            filter: (resourcePath) => {
              // Исключаем только SVG иконки
              const filename = path.basename(resourcePath);
              return !(filename.startsWith('icon-') && filename.endsWith('.svg'));
            }
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: './source/index.pug',
        filename: 'index.html',
        inject: true
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'css/style.min.css' : 'css/style.css',
      }),
      new SpriteLoaderPlugin({
        plainSprite: true,
        spriteAttrs: {
          id: 'svg-sprite'
        }
      }),
    ],
    optimization: {
      minimizer: [
        `...`,
        new CssMinimizerPlugin(),
      ],
    },
  };
};
