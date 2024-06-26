module.exports = {
  entry: './src/main.ts',
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
      },
    ],
  },
  output: {
    path: `${__dirname}/docs`,
    library: {
      type: 'global',
    },
  },
  mode: 'none',
  devtool: 'source-map',
};
