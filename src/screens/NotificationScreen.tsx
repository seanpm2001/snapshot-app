import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthState } from "context/authContext";
import common from "styles/common";
import i18n from "i18n-js";
import {
  NOTIFICATIONS_ACTIONS,
  useNotificationsDispatch,
  useNotificationsState,
} from "context/notificationsContext";
import ProposalNotification from "components/proposal/ProposalNotification";
import { useIsFocused } from "@react-navigation/native";
import get from "lodash/get";
import RNPusherPushNotifications from "react-native-pusher-push-notifications";
import Toast from "react-native-toast-message";
import pusherConfig from "constants/pusherConfig";
import { useToastShowConfig } from "constants/toast";
import Device from "helpers/device";

function NotificationScreen() {
  const { colors, connectedAddress, followedSpaces } = useAuthState();
  const {
    proposalTimes,
    proposals,
    lastViewedProposal,
    lastViewedNotification,
  } = useNotificationsState();
  const notificationsDispatch = useNotificationsDispatch();
  const lastViewedProposalIndex = useRef(Infinity);
  const insets = useSafeAreaInsets();
  const [onScreen, setOnScreen] = useState(true);
  const isFocused = useIsFocused();
  const toastShowConfig = useToastShowConfig();

  const init = (): void => {
    RNPusherPushNotifications.setInstanceId(pusherConfig.appId);

    RNPusherPushNotifications.on("notification", handleNotification);

    if (Device.isIos()) {
      RNPusherPushNotifications.setSubscriptions(
        [connectedAddress],
        (statusCode, response) => {
          console.log(statusCode, response);
          Toast.show({
            type: "customSuccess",
            text1: "SET SUB - " + JSON.stringify(response),
            ...toastShowConfig,
          });
        },
        () => {
          console.log("Success");
        }
      );
    }

    subscribe(connectedAddress ?? "");
  };

  const subscribe = (interest: string): void => {
    console.log(`Subscribing to "${interest}"`);
    RNPusherPushNotifications.subscribe(
      interest,
      (statusCode, response) => {
        console.error(statusCode, response, connectedAddress);
      },
      () => {
        console.log(`CALLBACK: Subscribed to ${connectedAddress}`);
      }
    );
  };

  const handleNotification = (notification: any): void => {
    console.log("HANDLE NOTIFICATION", { notification });
    try {
      Toast.show({
        type: "customSuccess",
        text1: JSON.stringify(notification),
        ...toastShowConfig,
      });
    } catch (e) {
      Toast.show({
        type: "customSuccess",
        text1: "you have received a notification",
        ...toastShowConfig,
      });
    }
    if (Platform.OS === "ios") {
      console.log("CALLBACK: handleNotification (ios)");
    } else {
      console.log("CALLBACK: handleNotification (android)");
      console.log(notification);
    }
  };

  function setOnScreenState(onScreenState: boolean) {
    setOnScreen(onScreenState);
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!onScreen) {
      notificationsDispatch({
        type: NOTIFICATIONS_ACTIONS.SET_LAST_VIEWED_NOTIFICATION,
        payload: {
          saveToStorage: true,
          time: get(proposalTimes[0], "time"),
          lastViewedProposal: get(proposalTimes[0], "id"),
        },
      });
      setOnScreenState(true);
    }
  }, [onScreen]);

  useEffect(() => {
    setOnScreenState(isFocused);
  }, [isFocused]);

  return (
    <View
      style={[
        common.screen,
        { paddingTop: insets.top, backgroundColor: colors.bgDefault },
      ]}
    >
      <View
        style={{
          backgroundColor: colors.bgDefault,
        }}
      >
        <View
          style={[
            common.headerContainer,
            { borderBottomColor: colors.borderColor },
          ]}
        >
          <Text style={[common.screenHeaderTitle, { color: colors.textColor }]}>
            {i18n.t("notifications")}
          </Text>
        </View>
      </View>
      <FlatList
        key={`${connectedAddress}${lastViewedProposal}`}
        data={followedSpaces.length > 0 ? proposalTimes : []}
        renderItem={(data) => {
          if (
            data?.item?.id === lastViewedProposal &&
            `${data?.item?.time}` === `${lastViewedNotification}`
          ) {
            lastViewedProposalIndex.current = data.index;
          }
          const proposalDetails = proposals[data?.item?.id];
          let didView = data.index >= lastViewedProposalIndex.current;

          if (lastViewedProposal === null && lastViewedNotification === null) {
            didView = false;
          }

          if (!proposalDetails) {
            return null;
          }

          return (
            <ProposalNotification
              proposal={proposalDetails}
              time={data.item?.time}
              event={data.item?.event}
              didView={didView}
            />
          );
        }}
        keyExtractor={(item) => `notification-${item.id}-${item.time}`}
        onEndReachedThreshold={0.6}
        onEndReached={() => {}}
        ListEmptyComponent={
          <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
            <Text style={[common.subTitle, { color: colors.textColor }]}>
              {i18n.t("noNewNotifications")}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View
            style={{
              width: "100%",
              height: 150,
              backgroundColor: colors.bgDefault,
            }}
          />
        }
      />
    </View>
  );
}

export default NotificationScreen;
