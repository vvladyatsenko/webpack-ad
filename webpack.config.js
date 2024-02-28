const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = !IS_DEV;

const optimization = () => {
  return {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [new CssMinimizerWebpackPlugin(), new TerserPlugin()],
  };
};

const filename = (ext) =>
  IS_DEV ? `[name].${ext}` : `[name].[fullhash].${ext}`;

const cssLoaders = (extra) => {
  const loaders = [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

pluginsSet = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'favicon.png'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new EslintWebpackPlugin({
      extensions: ['js'],
      fix: true,
    }),
  ];

  if (IS_PROD) {
    // code
  }
  if (IS_DEV) {
    // code
  }

  return plugins;
};

jsLoaders = (extra) => {
  const loaders = {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  };

  if (extra) {
    loaders.options.presets.push(extra);
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './index.jsx',
    stat: './statistics.ts',
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename('.js'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@model': path.resolve(__dirname, 'src/model'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: false,
  },
  devtool: IS_DEV ? 'source-map' : false,
  plugins: pluginsSet(),
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-typescript'),
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-react'),
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|svg|jpg|jpeg|webp|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        },
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
    ],
  },
};
