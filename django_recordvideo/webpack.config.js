const path = require('path');
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.resource$/, use: 'vue-resource' },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'] // BOTH are needed!
      }
    ],
  },
  //configureWebpack: { 
    //resolve: {
        //alias: {
            //'@': path.resolve(__dirname, 'src'),
        //}
   // },
  //},
  plugins: [
      new VueLoaderPlugin(),
  ],
};
