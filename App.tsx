/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import RootNavigation from './src/navigation/RootNavigation';

function App(): React.JSX.Element {
  // useEffect(() => {
  //   ensureAiReady().catch(e => console.error('AI init failed', e));
  // }, []);
  return <RootNavigation />;
}

export default App;
