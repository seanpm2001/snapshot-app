import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  button: {
    padding: 16,
    backgroundColor: colors.black,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  lightButton: {
    backgroundColor: colors.white,
    borderColor: colors.borderColor,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.3,
  },
  buttonTitle: {
    color: colors.white,
    fontSize: 20,
    fontFamily: "Calibre-Semibold",
  },
  lightButtonTitle: {
    color: colors.textColor,
  },
});

type ButtonProps = {
  onPress: () => void;
  title: string;
  buttonContainerStyle?: ViewStyle;
  buttonTitleStyle?: TextStyle;
  disabled?: boolean;
  light?: boolean;
  Icon?: React.FC | undefined;
};

function Button({
  onPress,
  title,
  buttonTitleStyle,
  buttonContainerStyle,
  disabled = false,
  light = false,
  Icon = undefined,
}: ButtonProps) {
  const ButtonContainerComponent = disabled
    ? TouchableWithoutFeedback
    : TouchableOpacity;

  return (
    <ButtonContainerComponent onPress={disabled ? () => {} : onPress}>
      <View
        style={[
          styles.button,
          light ? styles.lightButton : {},
          disabled ? styles.disabled : {},
          buttonContainerStyle,
        ]}
      >
        <Text
          style={[
            styles.buttonTitle,
            light ? styles.lightButtonTitle : {},
            buttonTitleStyle,
          ]}
        >
          {title}
        </Text>
        {Icon !== undefined && <Icon />}
      </View>
    </ButtonContainerComponent>
  );
}

export default Button;