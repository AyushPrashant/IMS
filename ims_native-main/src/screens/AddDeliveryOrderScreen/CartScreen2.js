import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomButton from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosConfig";
import serverUrl from "../../api/urls";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function CartScreen2() {
  const theme = useTheme();
  const { cart2, removeFromCart2, decreaseQuantity2, increaseQuantity2 } =
    useCart();

    // const cId = cart2.customerId;
    // c

  const [totalValue, setTotalValue] = useState("");

  const Navigation = useNavigation();
  // console.log(cart2);
  const placeOrder = async () => {
    //
    try {
      // console.log(cart2);
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString).godownId;
      // console.log(cart2.Quantity);
      // Prepare data in the required format
      const requestData = {
        products: cart2.map((item) => ({
          productName: item.ProductName,
          orderQuantity: item.Quantity, // Ensure Quantity is converted to integer
          sellPrice: (item.SellPrice),
        })),
      };
      // console.log(requestData);
      // Make POST request to the API endpoint
      const response = await api.post(
        `${serverUrl.placeOrder}${cart2[0].customerId}`,
        requestData
      );
      showMessage({
        message: "Success",
        description: "Order placed successfully",
        type: "success",
      });
      Navigation.navigate("Delivery");

      // console.log(response.data); // Log response from the API
    } catch (error) {

      // console.log("Error placing order:", error.response.data);
      Alert.alert("Order Failed", error.response.data);
    }
  };

  const calculateTotalSell = (cart2) => {
    return cart2.reduce((total, item) => {
      return total + parseFloat(item.SellPrice) * parseInt(item.Quantity);
    }, 0);
  };
  useEffect(() => {
    setTotalValue(calculateTotalSell(cart2));
  }, [cart2]);

  const renderFooter = () => {
    return (
      <View style={styles.lastList}>
        <Text style={[styles.finalValue, {color: theme.colors.text1}]}>Total Order Value: {totalValue}</Text>
        <CustomButton
          title="Place Order"
          // loading={loading}
          onSubmit={() => placeOrder(cart2)}
        />
      </View>
    );
  };

  const renderItems = ({ item }) => (
    <View style={[ {backgroundColor: theme.colors.cardBackground}]}>
      <View style={styles.itemView}>
        <View style={styles.leftContainer}>
          <Text style={[styles.nameText, {color: theme.colors.text1}]}>{item.ProductName}</Text>

          <Text style={[styles.priceText, {color: theme.colors.text5}]}>
            <FontAwesome name="inr" size={14} color={theme.colors.text5} />
            {item.SellPrice}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.minusPlus}>
            <TouchableOpacity
              onPress={() => {
                decreaseQuantity2(item.ProductName);
                setTotalValue((prevTotalValue) => calculateTotalSell(cart2));
              }}
            >
              <Text style={[styles.btn, {backgroundColor: theme.colors.cartBtn}]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.quantity, {color: theme.colors.text1}]}>{item.Quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                increaseQuantity2(item.ProductName);
                setTotalValue((prevTotalValue) => calculateTotalSell(cart2));
              }}
            >
              <Text style={[styles.btn, {backgroundColor: theme.colors.cartBtn}]}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              removeFromCart2(item.ProductName);
              setTotalValue(calculateTotalSell(cart2));
            }}
          >
            <Text style={{ color: "#3B444B" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View>
        <Text style={[styles.heading, {color: theme.colors.cartBtn}]}>Cart</Text>
      </View>
      <View style={styles.cartItems}>
        <FlatList
          data={cart2}
          renderItem={renderItems}
          keyExtractor={(item) => item.ProductName}
          ListEmptyComponent={<View></View>}
          ListFooterComponent={renderFooter}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    flex: 1,
  },
  box: {
    // backgroundColor: "rgb(248,251,253)",
  },
  minusPlus: {
    flexDirection: "row",
    marginTop: Dimensions.get("screen").height * 0.024,
  },
  img: {
    height: Dimensions.get("screen").height * 0.1,
    width: Dimensions.get("screen").width * 1,
  },
  itemView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    // backgroundColor: "#fff",
    borderRadius: 10,
    height: 100,
    borderBottomWidth: 1,
    borderColor: "rgb(228,228,227)",
  },
  // vol: {
  //   marginTop: 5,
  //   marginBottom: 5,
  //   fontSize: 14,
  // },
  leftContainer: {
    flex: 1,
    marginLeft: 10,
  },
  rightContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 10,
  },
  removeButton: {
    marginTop: Dimensions.get("window").width > 600 ? Dimensions.get("screen").height * 0.012 : Dimensions.get("screen").height * 0.02,
  },
  nameText: {
    marginBottom:5,
    fontSize: 17,
    fontWeight: "500",
  },
  btn: {
    fontSize: 20,
    paddingHorizontal: 10,
    marginRight: Dimensions.get("screen").width*0.025,
    textAlign: "center",
    height: 30,
    width: 30,
    marginRight: 8,
    // backgroundColor: "#AACF46",
    borderRadius: 10,
    color: "white",
  },
  qtyContainer: {
    width: 80,
    // flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgb(236,236,235)",
    borderRadius: 10,
    justifyContent: "space-around",
  },
  priceText: {
    fontSize: 15,
    // color: "rgb(100,105,110)",
  },
  cartItems: {
    marginLeft: 10,
    marginRight: 8,
    marginBottom: 10,
    borderRadius: 10,
  },
  heading: {
    alignItems: "flex-start",
    margin: 12,
    fontSize: Dimensions.get("window").width > 600 ? 35: 25,
    backgroundColor: "rgb(248,251,253)",
    height: 75,
    paddingTop: 20,
    // color: "#AACF46",
  },
  headingtxt: {
    fontSize: 19,
    fontWeight: "600",
  },
  placeOrderbtn: {
    // position: "absolute",
    // width: "50%",
    alignItems: "center",
    // backgroundColor: "#AACF46",
    // bottom: 0,
    // right: Dimensions.get("window").width * 0.25,
  },
  quantity: {
    marginRight: 10,
    top: Dimensions.get("screen").height * 0.005,
  },
  finalValue: {
    fontWeight: "bold",
    fontSize: 17,
  },
  lastList: {
    // flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
});
