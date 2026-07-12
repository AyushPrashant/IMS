import React from "react";
import { StyleSheet, View } from "react-native";
import {
  SegmentedButtons,
} from "react-native-paper";

const CustomSegmentButton=({state, onValueChange, theme}) => {
    return (

        <View>
          <SegmentedButtons
              theme={theme}
              value={state}
              onValueChange={onValueChange}
              buttons={[
                { value: "Products Sold", label: "Products Sold", checkedColor:'white', uncheckedColor: theme.colors.text3},
                { value: "Orders Received", label: "Orders Received", checkedColor:'white', uncheckedColor: theme.colors.text3 },
              ]}

            />
            
        </View>
     
    )
}

const styles = StyleSheet.create({})

export default CustomSegmentButton;