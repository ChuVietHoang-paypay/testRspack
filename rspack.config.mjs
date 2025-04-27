import path from 'node:path';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import getSharedDependencies from './sharedDeps.js';

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default env => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    entry = './index.js',
    platform = process.env.PLATFORM,
  } = env;
  const dirname = Repack.getDirname(import.meta.url);

  if (!platform) {
    throw new Error('Missing platform');
  }
  return {
    mode,
    context,
    entry,
    experiments: {
      incremental: mode === 'development',
    },
    resolve: {
      ...Repack.getResolveOptions(),
      alias: {
        '@src': path.resolve(dirname, 'src'),
        // Fix strict import của native-stack
        './views/NativeStackView': path.resolve(
          dirname,
          'node_modules/@react-navigation/native-stack/lib/module/views/NativeStackView.native.js',
        ),
      },
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules(),
        {
          test: /\.jsx?$/,
          type: 'javascript/auto',
          exclude: /node_modules/,
          use: {
            loader: '@callstack/repack/flow-loader',
            options: {all: true},
          },
        },
      ],
    },
    output: {
      uniqueName: 'sas-host',
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'host',
        dts: false,
        remotes: {},
        shared: getSharedDependencies({eager: true}),
      }),
      // silence missing @react-native-masked-view optionally required by @react-navigation/elements
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  };
};
