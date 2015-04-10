var webpack = require('webpack');

module.exports = function(options) {
  options = (options ? options : {});

  var plugins = [];

  if (options.minify) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin()
    );
  }

  if (!options.dev) {
    plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }),
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
    );
  }

  return {
    entry: {
      isomer: './index.js'
    },
    output: {
      library: 'Isomer',
      libraryTarget: 'umd',
      path: '/',
      filename: (options.dev ? '[name].js' : (options.minify ? './dist/[name].min.js': './dist/[name].js')),
      sourceMapFilename: '[file].map'
    },

    module: {
      preLoaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jscs-loader'
      }]
    },

    plugins: plugins,
    debug: (options.dev),
    devtool: (options.dev ? 'eval-source-map': undefined)
  };
};
