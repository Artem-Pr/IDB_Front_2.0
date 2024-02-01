const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {paths} = require('../variables.js');

module.exports = (isDevelopment) => ({
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".png", "jpg", ".scss"],
        alias: {
            'src': paths.src,
        }
    },
    module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: paths.nodeModules,
            use: {
              loader: "ts-loader",
            },
          },
          {
            test: /\.(js)$/,
            exclude: paths.nodeModules,
            use: {
              loader: "babel-loader",
            },
          },
          {
            test: /\.(png|svg|jpe?g|gif|ico)$/i,
            use: {
                loader: 'file-loader',
            },
          },
          {
            test: /\.css$/i,
            use: [
              "css-loader"
            ],
          },
          {
            test: /\.module\.s[ac]ss$/,
            use: [
              isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  sourceMap: isDevelopment
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: isDevelopment
                }
              }
            ]
          },
          {
            test: /\.s(a|c)ss$/,
            exclude: /\.module.(s(a|c)ss)$/,
            use: [
              isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: isDevelopment
                }
              }
            ]
          }
        ],
      },
});