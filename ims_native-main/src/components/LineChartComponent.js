import { Dimensions, View } from "react-native";
import { Text } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
import { StyleSheet } from "react-native";
import { color } from "react-native-elements/dist/helpers";

const dummyData = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 20 },
  { label: "Mar", value: 30 },
  { label: "Apr", value: 50 },
  { label: "May", value: 10 },
  { label: "Jun", value: 20 },
  { label: "Jul", value: 30 },
  { label: "Aug", value: 50 },
  { label: "Sep", value: 10 },
  { label: "Oct", value: 20 },
  { label: "Nov", value: 30 },
  { label: "Dec", value: 50 },
];

const LineChartComponent = ({ data, initialPos, theme }) => {
  const modifiedData = data.map((item) => ({...item}));
  const maxThreshold = Math.max(...modifiedData.map(item => item.value));
  const minThreshold = maxThreshold * 0.1;

  modifiedData.forEach((item) => {
      if (item.value == 0 || item.value < minThreshold) {
          item.value = minThreshold;
      }
  });

  return (
    <>
      <View style={styles.container}>
        <Text
          variant="titleSmall"
          style={{ textAlign: "left", color: theme.colors.text1 }}
        >
          Sales Overview
        </Text>
        <LineChart
          data={modifiedData.length > 0 ? modifiedData : dummyData}
          curved
          yAxisOffset={0}
          initialSpacing={15}
          hideDataPoints
          barMarginBottom={2}
          xAxisLabelsVerticalShift={5}
          xAxisColor="transparent"
          yAxisColor="transparent"
          color="#0BA5A4"
          yAxisTextStyle={{ fontSize: Dimensions.get("window").width > 600 ? Dimensions.get("window").width*0.02:Dimensions.get("window").width * 0.03,color: theme.colors.text3, }}
          xAxisLabelTextStyle={{
            fontSize: Dimensions.get("window").width > 600 ? Dimensions.get("window").width*0.02:Dimensions.get("window").width * 0.03,color: theme.colors.text3,
            // fontSize: Dimensions.get("window").width * 0.028,
          }}
          rulesType="solid"
          // rulesColor="#f2f2f2"
          hideRules
          areaChart
          startFillColor="rgba(14,164,164,0.3)"
          endFillColor="rgba(14,164,164,0)"
          startOpacity={0.6}
          endOpacity={0.1}
          spacing={60}
          height={Dimensions.get("window").height * 0.22}
          scrollToIndex={initialPos}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LineChartComponent;
