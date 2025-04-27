/**
 * @format
 */

import {AppRegistry, Platform, View} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {ScriptManager} from '@callstack/repack/client';
import {init, registerRemotes} from '@module-federation/runtime';
import {useEffect, useState} from 'react';

// Danh sách cache keys cần xóa khi khởi động
const CACHE_KEYS_TO_CLEAR = [
  '__webpack_require__cache',
  '__federation_shared_scope',
];

const AppContainer = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await ScriptManager.shared.invalidateScripts();
        init({
          name: 'host',
          remotes: [
            {
              name: 'mini',
              entry: `http://localhost:9003/${Platform.OS}/mf-manifest.json`,
            },
          ],
        });
        // registerRemotes(
        //   [
        //     {
        //       name: 'mini',
        //       entry: `http://localhost:9003/${Platform.OS}/mf-manifest.json`,
        //     },
        //   ],
        //   {force: true},
        // );

        // Chuyển từ AppLoading sang App chính
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Ngay cả khi có lỗi, vẫn cố gắng chuyển sang App chính
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  return isInitialized ? <App /> : <View />;
};

AppRegistry.registerComponent(appName, () => AppContainer);
