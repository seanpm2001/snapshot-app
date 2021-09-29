import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/screens/AppNavigator";
import { withWalletConnect } from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { ExploreProvider } from "./src/context/exploreContext";
import storage from "./src/util/storage";
import { AUTH_ACTIONS, useAuthDispatch } from "./src/context/authContext";
import { ContextDispatch } from "./src/types/context";

async function loadFromStorage(
  authDispatch: ContextDispatch,
  setLoading: (loading: boolean) => void
) {
  try {
    const connectedAddress = await storage.load(storage.KEYS.connectedAddress);
    if (connectedAddress) {
      authDispatch({
        type: AUTH_ACTIONS.SET_CONNECTED_ADDRESS,
        payload: {
          connectedAddress,
          addToStorage: false,
        },
      });
    }
  } catch (e) {}
  setLoading(false);
}

function MainApp() {
  return (
    <ActionSheetProvider>
      <ExploreProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ExploreProvider>
    </ActionSheetProvider>
  );
}

const WrappedMainApp = withWalletConnect(MainApp, {
  redirectUrl: "org.snapshot",
  clientMeta: {
    description: "Snapshot Mobile App",
    url: "https://snapshot.org",
    icons: [
      "https://raw.githubusercontent.com/snapshot-labs/brand/master/avatar/avatar.png",
    ],
    name: "snapshot",
  },
  storageOptions: {
    //@ts-ignore
    asyncStorage: AsyncStorage,
  },
});

function AppWrapper() {
  const [loading, setLoading] = useState(true);
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    loadFromStorage(authDispatch, setLoading);
    StatusBar.setBarStyle("dark-content", true);
  }, []);

  if (loading) {
    return <View />;
  }

  return <WrappedMainApp />;
}

export default AppWrapper;
