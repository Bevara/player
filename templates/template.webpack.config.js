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
        exclude: ["/node_modules/", "/third_parties"],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'universal-tags.js',
    path: path.resolve("@CMAKE_BINARY_DIR@", 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "templates/index.html",
    })
  ],
  devServer: {
    open: 'true',
    host: "localhost",
    contentBase: "@CMAKE_BINARY_DIR@",
    port: 8081
  },
};

const config_img = {
  entry: './webinterface/UImage.ts',
  output: {
    filename: 'universal-img.js',
    path: path.resolve("@CMAKE_BINARY_DIR@", 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/", "/third_parties"],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
      "zlib": false,
      "stream": false,
      "crypto": false,
      "http": false,
      "https": false,
      "net": false,
      "tls": false,
      "utf-8-validate": false,
      "bufferutil": false
    }
  },
  mode: 'production'
};

const config_audio = {
  entry: './webinterface/UAudio.ts',
  output: {
    filename: 'universal-audio.js',
    path: path.resolve("@CMAKE_BINARY_DIR@", 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/", "/third_parties"],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
      "zlib": false,
      "stream": false,
      "crypto": false,
      "http": false,
      "https": false,
      "net": false,
      "tls": false,
      "utf-8-validate": false,
      "bufferutil": false
    }
  },
  mode: 'production'
};

const config_video = {
  entry: './webinterface/UVideo.ts',
  output: {
    filename: 'universal-video.js',
    path: path.resolve("@CMAKE_BINARY_DIR@", 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/", "/third_parties"],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
      "zlib": false,
      "stream": false,
      "crypto": false,
      "http": false,
      "https": false,
      "net": false,
      "tls": false,
      "utf-8-validate": false,
      "bufferutil": false
    }
  },
  mode: 'production'
};

const config_canvas = {
  entry: './webinterface/UCanvas.ts',
  output: {
    filename: 'universal-canvas.js',
    path: path.resolve("@CMAKE_BINARY_DIR@", 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/", "/third_parties"],
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
  mode: 'production'
};


module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }

  config.resolve = {
    ...config.resolve,
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
      "zlib": false,
      "stream": false,
      "crypto": false,
      "http": false,
      "https": false,
      "net": false,
      "tls": false,
      "utf-8-validate": false,
      "bufferutil": false
    }
  };

  return [config, config_img, config_audio, config_video, config_canvas];
};

