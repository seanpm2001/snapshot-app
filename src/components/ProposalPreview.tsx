import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Dimensions,
  Platform,
} from "react-native";
import colors from "../constants/colors";
import { Proposal } from "../types/proposal";
import { getTimeAgo, shorten } from "../helpers/miscUtils";
import StateBadge from "./StateBadge";
import { useNavigation } from "@react-navigation/native";
import { PROPOSAL_SCREEN } from "../constants/navigation";
import removeMd from "remove-markdown";
import i18n from "i18n-js";
import { useExploreState } from "../context/exploreContext";
import SpaceAvatar from "./SpaceAvatar";
import CoreBadge from "./CoreBadge";
import { Space } from "../types/explore";
import { getUsername } from "../helpers/profile";
import isEmpty from "lodash/isEmpty";
import { useAuthState } from "../context/authContext";

const { width } = Dimensions.get("screen");

const previewPadding = 16;
const avatarSize = 28;
const stateBadgeMaxWidth = 80;
const coreWidth = 42;
const defaultAuthorTextWidth =
  width - 2 * previewPadding - avatarSize - stateBadgeMaxWidth - 8;

const styles = StyleSheet.create({
  proposalPreviewContainer: {
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: previewPadding,
  },
  header: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: 14,
  },
  headerAuthor: {
    color: colors.darkGray,
    fontSize: 18,
    marginLeft: 8,
    fontFamily: "Calibre-Medium",
    lineHeight: 28,
    marginTop: Platform.OS === "ios" ? 4 : 0,
  },
  authorContainer: {
    flexDirection: "row",
    width: defaultAuthorTextWidth,
    marginRight: 10,
    alignItems: "center",
  },
  statusContainer: {
    marginLeft: "auto",
  },
  title: {
    color: colors.headingColor,
    fontFamily: "Calibre-Semibold",
    fontSize: 24,
    lineHeight: 30,
  },
  body: {
    color: colors.darkGray,
    fontFamily: "Calibre-Medium",
    fontSize: 20,
    marginVertical: 8,
    lineHeight: 30,
  },
  period: {
    fontSize: 18,
    color: colors.darkGray,
    fontFamily: "Calibre-Medium",
  },
});

function getPeriod(state: string, start: number, end: number) {
  if (state === "closed") {
    return i18n.t("endedAgo", { timeAgo: getTimeAgo(end) });
  } else if (state === "active") {
    return i18n.t("endIn", { timeAgo: getTimeAgo(end) });
  }
  return i18n.t("startIn", { timeAgo: getTimeAgo(start) });
}

type ProposalPreviewProps = {
  proposal: Proposal;
  space: Space;
  fromFeed?: boolean;
};

function ProposalPreview({
  proposal,
  space,
  fromFeed = false,
}: ProposalPreviewProps) {
  const navigation: any = useNavigation();
  const { connectedAddress, colors } = useAuthState();
  const { profiles } = useExploreState();
  const formattedBody = useMemo(
    () => shorten(removeMd(proposal.body), 140).replace(/\r?\n|\r/g, " "),
    [proposal]
  );
  const title = useMemo(() => shorten(proposal.title, 124), [proposal]);
  const period = useMemo(
    () => getPeriod(proposal.state, proposal.start, proposal.end),
    [proposal]
  );
  const authorProfile = profiles[proposal.author];
  const authorName = getUsername(
    proposal.author,
    authorProfile,
    connectedAddress ?? ""
  );
  const isCore = useMemo(() => {
    if (isEmpty(space?.members)) return false;
    let updatedMembers = space.members.map((address: string) =>
      address.toLowerCase()
    );
    return updatedMembers.includes(proposal.author.toLowerCase());
  }, [proposal, space]);

  return (
    <TouchableHighlight
      underlayColor={colors.highlightColor}
      onPress={() => {
        navigation.navigate(PROPOSAL_SCREEN, { proposal, fromFeed });
      }}
    >
      <View style={styles.proposalPreviewContainer}>
        <View style={styles.header}>
          <SpaceAvatar symbolIndex="space" size={28} space={proposal.space} />
          <View
            style={[
              styles.authorContainer,
              {
                width: isCore
                  ? defaultAuthorTextWidth - coreWidth
                  : defaultAuthorTextWidth,
              },
            ]}
          >
            <Text
              style={styles.headerAuthor}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {proposal.space.name} by {authorName}
            </Text>
            <CoreBadge
              address={proposal.author}
              members={space?.members}
              key={proposal.id}
            />
          </View>
          <View style={styles.statusContainer}>
            <StateBadge state={proposal.state} />
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.title,
              { color: colors.textColor },
              { marginBottom: isEmpty(formattedBody) ? 8 : 0 },
            ]}
          >
            {title}
          </Text>
          {!isEmpty(formattedBody) && (
            <Text style={[styles.body, { color: colors.secondaryTextColor }]}>
              {formattedBody}
            </Text>
          )}
          <Text style={[styles.period, { color: colors.secondaryTextColor }]}>
            {period}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default ProposalPreview;
