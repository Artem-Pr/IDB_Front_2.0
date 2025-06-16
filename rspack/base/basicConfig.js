const {paths} = require('../variables.js');

module.exports = (isDevelopment) => ({
  entry: paths.entry,
  experiments: { css: true },
  resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".png", "jpg", ".scss"],
      alias: {
          'src': paths.src,
      }
  },
  module: {
    generator: {
      'css/auto': {
        // local - class name, 
        // name - file name
        // id - relative path (long format)
        // hash - hash of file
        // uniqueName - project name
        localIdentName: isDevelopment ? '[hash:8]-[local]' : '[uniqueName]-[id]-[local]',
      },
    },
    parser: {
      'css/auto': {
        namedExports: false,
      },
    },
    rules: [
      {
        test: /\.(j|t)s$/,
        exclude: [/[\\/]node_modules[\\/]/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
            externalHelpers: true,
            transform: {
              react: {
                pragma: 'React.createElement',
                pragmaFrag: 'React.Fragment',
                throwIfNamespace: true,
                development: isDevelopment,
                refresh: isDevelopment,
                useBuiltins: false,
              },
            },
          },
          env: {
            targets: 'Chrome >= 48',
          },
        },
      },
      {
        test: /\.(j|t)sx$/,
        loader: 'builtin:swc-loader',
        exclude: [/[\\/]node_modules[\\/]/],
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                pragma: 'React.createElement',
                pragmaFrag: 'React.Fragment',
                throwIfNamespace: true,
                development: isDevelopment,
                refresh: isDevelopment,
                useBuiltins: false,
              },
            },
            externalHelpers: true,
          },
          env: {
            targets: 'Chrome >= 48', // browser compatibility
          },
        },
      },
      {
        test: /\.(png|svg|jpe?g|gif|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
              // using `modern-compiler` and `sass-embedded` together significantly improve build performance,
              // requires `sass-loader >= 14.2.1`
              api: 'modern-compiler',
              implementation: require.resolve('sass-embedded'),
            },
          },
        ],
        // set to 'css/auto' if you want to support '*.module.(scss|sass)' as CSS Modules, otherwise set type to 'css'
        type: 'css/auto',
      },
    ],
  },
});