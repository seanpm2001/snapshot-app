import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import i18n from "i18n-js";
import isEmpty from "lodash/isEmpty";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  badge: {
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginLeft: 4,
  },
  badgeTitle: {
    fontSize: 14,
    fontFamily: "Calibre-Medium",
    lineHeight: 23,
    color: colors.textColor,
    textTransform: "capitalize",
  },
});

type CoreBadgeProps = {
  address: string;
  members: string[];
};

function CoreBadge({ address, members = [] }: CoreBadgeProps) {
  const isCore = useMemo(() => {
    if (isEmpty(members)) return false;
    let updatedMembers = members.map((address) => address.toLowerCase());
    return updatedMembers.includes(address.toLowerCase());
  }, [address, members]);

  if (isCore) {
    return (
      <View style={styles.badge}>
        <Text style={styles.badgeTitle}>{i18n.t("core")}</Text>
      </View>
    );
  }
  return <View />;
}

export default CoreBadge;