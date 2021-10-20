const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
    entry: './webinterface/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/","/third_parties"],
              },
              {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
              },
              {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
              }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'img.js',
        path: path.resolve("/Users/gorinje/project/player/build", 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "templates/index.html",
          })
    ],
    devServer: {
        open: 'true',
        host: "localhost",
        contentBase: "/Users/gorinje/project/player/build",
        port:8081
      },
};

module.exports = () => {
    if (isProduction) {
      config.mode = "production";
  
      config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
      config.mode = "development";
    }
    return config;
  };
  
