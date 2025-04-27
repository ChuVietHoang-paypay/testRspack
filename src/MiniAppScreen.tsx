import {View, Text} from 'react-native';
import React from 'react';
import {loadRemote} from '@module-federation/runtime';
const MiniScreen = React.lazy(() => loadRemote('mini/App'));
const MiniAppScreen = () => {
  return (
    <React.Suspense fallback={null}>
      <MiniScreen />
    </React.Suspense>
  );
};

export default MiniAppScreen;
