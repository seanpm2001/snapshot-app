import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import i18n from "i18n-js";
import Block from "../Block";
import common from "../../styles/common";
import Input from "../Input";
import colors from "../../constants/colors";
import Button from "../Button";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import VotingTypeModal from "./VotingTypeModal";
import ChoiceInput from "./ChoiceInput";

const { width } = Dimensions.get("screen");

type ChoicesBlockProps = {
  choices: string[];
  setChoices: (choices: string[]) => void;
  votingType: { key: string; text: string };
  setVotingType: (votingType: { key: string; text: string }) => void;
};

function ChoicesBlock({
  choices,
  setChoices,
  votingType,
  setVotingType,
}: ChoicesBlockProps) {
  const [showVotingTypeModal, setShowVotingTypeModal] = useState(false);
  return (
    <>
      <Block
        title={i18n.t("choices")}
        Content={
          <View
            style={[
              common.containerHorizontalPadding,
              common.containerVerticalPadding,
            ]}
          >
            <Button
              title={votingType.text}
              onPress={() => {
                setShowVotingTypeModal(true);
              }}
              buttonContainerStyle={{ marginBottom: 20 }}
            />
            {choices.map((choice: string, i: number) => {
              return (
                <ChoiceInput
                  choice={choice}
                  setChoices={setChoices}
                  index={i}
                  choices={choices}
                  key={i}
                />
              );
            })}
            <Button
              title={i18n.t("addChoice")}
              onPress={() => {
                setChoices(choices.concat(""));
              }}
            />
          </View>
        }
      />
      <VotingTypeModal
        isVisible={showVotingTypeModal}
        setVotingType={setVotingType}
        onClose={() => {
          setShowVotingTypeModal(false);
        }}
      />
    </>
  );
}

export default ChoicesBlock;
