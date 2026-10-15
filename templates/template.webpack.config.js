const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
// webpack's own minimizer, to configure where licence comments go.
let TerserPlugin = null;
try { TerserPlugin = require("terser-webpack-plugin"); } catch { /* minified with webpack's defaults */ }

const isProduction = process.env.NODE_ENV == "production";
const version = require("./version.js").version;

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
    filename: 'universal-tags_'+version+'.js',
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
    port: 8081,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
};

const config_img = {
  entry: './webinterface/UImage.ts',
  output: {
    filename: 'universal-img_'+version+'.js',
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
    filename: 'universal-audio_'+version+'.js',
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
    filename: 'universal-video_'+version+'.js',
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
    filename: 'universal-canvas_'+version+'.js',
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

  // Keep the licence notices of the bundled code (JSZip, pako...) inside each
  // script: a tag script is copied alone next to a page (bevara update-page),
  // without the .LICENSE.txt webpack would otherwise write beside it.
  for (const c of [config, config_img, config_audio, config_video, config_canvas]) {
    if (TerserPlugin) c.optimization = { ...c.optimization, minimizer: [new TerserPlugin({ extractComments: false })] };
  }

  return [config, config_img, config_audio, config_video, config_canvas];
};

