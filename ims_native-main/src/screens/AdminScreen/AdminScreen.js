import React, { useState, useContext , useEffect } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import {
  Provider as PaperProvider,
  useTheme,
  Text,
  Card,
} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import LineChartComponent from "../../components/LineChartComponent";
import FloatingActionButton from "../../components/FloatingActionButton";
import Container from "../../components/Container";
import Layout from "../../components/Layout";
import {Context as UserContext} from "../../context/UserContext";
import serverUrl from "../../api/urls";
import api from "../../api/axiosConfig";
import CustomSegmentButton from "./components/CustomSegmentButton";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import Spinner from "../../components/Spinner";
function ReduceOrderDetails(array) {
  return array.map((el) => {
    return {
      label: el.Month,
      value: el.orderQuantity,
    };
  });
}

function ReduceSalesDetails(array) {
  return array.map((el) => {
    return {
      label: el.Month,
      value: el.salesCount,
    };
  });
}
function capitalizeFirstLetter(string) {
  if (string != null) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else return string;
}

const AdminScreen = ({ route }) => {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState(Number(1));
  const [items, setItems] = useState([]);
  const [Data, setData] = useState([]);
  const [Revenue, SetRevenue] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("Products Sold");
  const [currMonth, setCurrMonth] = useState(new Date().getMonth());
  const [loading, setloading] = useState(true);
  // line chart data
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [orderQuantityByMonth, setOrderQuantityByMonth] = useState([]);
  const [godownheadName, setGodownheadName] = useState();

  // const updateState = (newState, setState) => {
  //   setState((prevState) => ({ ...prevState, ...newState }));
  // };
  const [availableCap, setAvailableCap] = useState(0);
  const {state} = useContext(UserContext);

  const godownLeftCapacity = () => {
    return new Promise((resolve, reject) => {
      api
        .get(`${serverUrl.getCapacity}${selectedValue}`)
        .then((response) => {
          setAvailableCap(response.data.availableCapacity);
          resolve();
        })
        .catch((error) => {
          console.log("Error fetching Data", error);
          reject(error);
        });
    });
  };

  const godownData = () => {
    return new Promise((resolve, reject) => {
      api
        .get(`${serverUrl.getAllGodown}`)
        .then((response) => {
          setData(response.data);
          const dropdownItems = response.data.map((godown, index) => ({
            label: "Godown " + godown.godownId,
            value: godown.godownId,
          }));
          setItems(dropdownItems);
          resolve();
        })
        .catch((error) => {
          console.log("Error fetching Data ", error);
          reject(error);
        });
    });
  };

  const revenueData = () => {
    return new Promise((resolve, reject) => {
      api
        .get(`${serverUrl.getAllDelivery}`)
        .then((response) => {
          let total = 0;
          const sales = response.data;
          sales.forEach((element) => {
            total += element.totalSellPrice;
          });
          SetRevenue(total);
          resolve();
        })
        .catch((error) => {
          console.log("error fetching data", error);
          reject(error);
        });
    });
  };

  const getOrderQuantityDataByMonth = () => {
    return new Promise(async (resolve, reject) => {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const url = `${serverUrl.getOrderQuantityByMonth}${selectedValue}`;
      api
        .get(url, {})
        .then((response) => {
          const newData = ReduceOrderDetails(response.data);
          resolve(newData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getSalesByDataMonth = () => {
    return new Promise(async (resolve, reject) => {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const url = `${serverUrl.getSalesByMonth}${selectedValue}`;
      api
        .get(url, {})
        .then((response) => {
          const newData = ReduceSalesDetails(response.data);
          resolve(newData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getGodownHeadInfo = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem("user")
        .then((userString) => {
          const user = JSON.parse(userString);
          api
            .get(serverUrl.getGH + user.godownHeadId)
            .then((response) => {
              setGodownheadName(response.data.godownHeadName);
              resolve();
            })
            .catch((error) => {
              console.log("error fetching data", error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log("error retrieving user data", error);
          reject(error);
        });
    });
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    setCurrMonth(new Date().getMonth());
    getOrderQuantityDataByMonth().then((data) => {
      setOrderQuantityByMonth(data);
    });

    getSalesByDataMonth().then((data) => {
      setSalesByMonth(data);
    });
  }, [selectedValue]);

  useEffect(() => {
    const fetchData = async () => {
      await godownData();
      await revenueData();
      await getGodownHeadInfo();
    };
    fetchData().finally(() => setloading(false));
  }, [isFocused]);

  useEffect(() => {
    godownLeftCapacity();
  }, [selectedValue]);

  return (
    <>
              <Layout route={route}>

      <PaperProvider>
        {loading ? (
          <Spinner animating={loading} color={"#0BA5A4"} size={"large"} />
        ) : (
          <>
            <ScrollView
              style={
                {
                  // backgroundColor: "#fff",
                }
              }
            >
              <Container>
                <View style={styles.header}>
                  <Text
                    style={[styles.welcomeTxt, { color: theme.colors.text1 }]}
                  >
                    WELCOME BACK
                  </Text>
                  <Text
                    style={[styles.userNameTxt, { color: theme.colors.text1 }]}
                  >
                    {capitalizeFirstLetter(godownheadName)}
                  </Text>
                </View>
                <View>
                  <Dropdown
                    label="Select Godown"
                    placeholder="Select Godown"
                    data={items}
                    value={selectedValue}
                    onChange={(item) => setSelectedValue(item.value)}
                    style={{
                      borderColor: theme.colors.borderColor,
                      borderWidth: 1,
                      borderRadius: 10,
                      height: 50,
                      paddingLeft: "5%",
                      padding: 10,
                      backgroundColor: theme.colors.background,
                    }}
                    labelField="label"
                    valueField="value"
                    activeColor='no'
                    selectedTextStyle={{color:theme.colors.borderColor}}
                    containerStyle={{borderRadius:3,backgroundColor:theme.colors.background}}
                    itemTextStyle={{color:theme.colors.text1}}
                  />
                </View>
                <View
                  style={[
                    styles.overview,
                    { backgroundColor: theme.colors.cardBackground2 },
                  ]}
                >
                  <View style={[styles.cards]}>
                    <Card
                      style={[
                        styles.card1,
                        { backgroundColor: theme.colors.cardBackground },
                      ]}
                    >
                      <Card.Content>
                        <View style={styles.iconContainer}>
                          <Image
                            source={
                              state.isDarkThemeOn === 'dark'                                           
                                                       ? require('../../../assets/capacity_White.png')
                                                       : require('../../../assets/capacity.png')
                                                   }
                            style={styles.icon}
                          />
                        </View>
                        <View style={styles.value}>
                          <Text
                            style={[
                              styles.valueTxt,
                              { color: theme.colors.valueText },
                            ]}
                          >
                            {availableCap}
                          </Text>
                        </View>
                        <View style={styles.value}>
                          <Text
                            style={[
                              styles.headingTxt,
                              { color: theme.colors.headingText },
                            ]}
                          >
                            Capacity Left
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                    <Card
                      style={[
                        styles.card2,
                        { backgroundColor: theme.colors.cardBackground },
                      ]}
                    >
                      <Card.Content>
                        <View style={styles.iconContainer}>
                          <Image
                            source={
                              state.isDarkThemeOn === 'dark'                                           
                                                       ? require('../../../assets/revenue_White.png')
                                                       : require('../../../assets/revenue.png')
                                                   }
                            style={styles.icon}
                          />
                        </View>
                        <View style={styles.value}>
                          <Text
                            style={[
                              styles.valueTxt,
                              { color: theme.colors.valueText },
                            ]}
                          >
                            ₹{Revenue}
                          </Text>
                        </View>
                        <View style={styles.value}>
                          <Text
                            style={[
                              styles.headingTxt,
                              { color: theme.colors.headingText },
                            ]}
                          >
                            Revenue
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                  </View>
                  <View style={styles.cards}>
                    <Card
                      style={[
                        styles.card1,
                        { backgroundColor: theme.colors.cardBackground },
                      ]}
                    >
                      <Card.Content>
                        <View style={styles.iconContainer}>
                          <Image
                            source={
                              state.isDarkThemeOn === 'dark'                                           
                                                       ? require('../../../assets/godown_White.png')
                                                       : require('../../../assets/godown.png')
                                                   }
                            style={[styles.icon]}
                          />
                        </View>
                        <View style={styles.value}>
                          <Text
                            style={[
                              styles.valueTxt,
                              { color: theme.colors.valueText },
                            ]}
                          >
                            {Data.length}
                          </Text>
                        </View>
                        <View style={styles.value}>
                          <Text
                            style={[
                              styles.headingTxt,
                              { color: theme.colors.headingText },
                            ]}
                          >
                            Total Godowns
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                    <Card
                      style={[
                        styles.card2,
                        { backgroundColor: theme.colors.cardBackground },
                      ]}
                    >
                      <Card.Content>
                        <View style={styles.iconContainer}>
                          <Image
                            source={
                              state.isDarkThemeOn === 'dark'                                           
                                                       ? require('../../../assets/capacity_White.png')
                                                       : require('../../../assets/capacity.png')
                                                   }
                            style={styles.icon}
                          />
                        </View>
                        <View style={styles.value}>
                          <Text
                            style={[
                              styles.valueTxt,
                              { color: theme.colors.valueText },
                            ]}
                          >
                            {selectedValue && Data.length > selectedValue - 1
                              ? Data[selectedValue - 1].volume
                              : 0}
                          </Text>
                        </View>
                        <View style={styles.value}>
                          <Text
                            style={[
                              styles.headingTxt,
                              { color: theme.colors.headingText },
                            ]}
                          >
                            Godown Capacity{" "}
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                  </View>
                </View>
                <View
                  style={[
                    styles.overview,
                    { backgroundColor: theme.colors.cardBackground2 },
                  ]}
                >
                  <View style={styles.sbtn}>
                    <CustomSegmentButton
                      state={selectedSegment}
                      onValueChange={(value) => setSelectedSegment(value)}
                      theme={theme}
                    />
                  </View>

                  {selectedSegment === "Products Sold" ? (
                    <LineChartComponent
                      data={Object.values(orderQuantityByMonth)}
                      initialPos={currMonth - 1}
                      theme={theme}
                    />
                  ) : (
                    <LineChartComponent
                      data={Object.values(salesByMonth)}
                      initialPos={currMonth - 1}
                      theme={theme}
                    />
                  )}
                </View>
              </Container>
            </ScrollView>
            <View>
            <FloatingActionButton theme={theme} />
            </View>
          </>
        )}
      </PaperProvider>
      </Layout>

    </>
  );
};
const styles = StyleSheet.create({
  cards: {
    flexDirection: "row",
    justifyContent: "space-between", // Optional: to evenly space the cards
    paddingHorizontal: Dimensions.get("window").width > 600 ?Dimensions.get("window").width*0.02 :0, // Optional: to add some space around the cards
    paddingVertical:  Dimensions.get("window").height > 600 ?Dimensions.get("window").height*0.005 :0,
  },
  card1: {
    flexDirection: "row",
    width: Dimensions.get("screen").width * 0.38, // Adjust the width as needed
    height: Dimensions.get("screen").height * 0.15,
    marginTop: 20,
    textAlign: "center",
  },
  card2: {
    flexDirection: "row",
    width: Dimensions.get("screen").width * 0.38, // Adjust the width as needed
    height: Dimensions.get("screen").height * 0.15,
    marginTop: 20,
    textAlign: "center",
  },
  sbtn: {
    marginTop: 13,
    backgroundColor: "white",
    borderRadius: 20,
  },
  overview: {
    marginTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  overviewText: {
    paddingTop: 10,
    fontSize: 17,
    fontWeight: "bold",
  },
  icon: {
    width: (Dimensions.get("screen").height * 0.15) / 3,
    height: (Dimensions.get("screen").height * 0.15) / 3,
  },

  value: {
    marginTop: (Dimensions.get("screen").height * 0.15) / 35,
  },
  headingTxt: {
    fontSize: Dimensions.get("window").width > 600 ? 23 : 11,
  },
  valueTxt: {
    fontWeight: "bold",
    fontSize: 17,
  },
  header: {
    height: 60,
  },
  welcomeTxt: {
    fontWeight: "bold",
    color: "rgb(100,105,110)",
    fontSize: 11,
  },
  userNameTxt: {
    fontSize: Dimensions.get("window").width > 600 ? 30 : 21,
    fontWeight: "bold",
  },
});

export default AdminScreen;
