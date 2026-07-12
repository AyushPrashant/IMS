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
import { color } from "react-native-elements/dist/helpers";
export default function CartScreen() {
  const { cart, setCart, removeFromCart, decreaseQuantity, increaseQuantity } =
    useCart();
  const theme = useTheme();
  const [totalValue, setTotalValue] = useState("");

  const Navigation = useNavigation();

  const placeOrder = async () => {
    // console.log(cart);
    try {
      const userString = await AsyncStorage.getItem("user");

      const user = JSON.parse(userString).godownId;

      // Calculate total volume of products in the cart
      const totalVolume = cart.reduce((total, item) => {
        return total + parseFloat(item.productVolume) * parseInt(item.Quantity);
      }, 0);

      // Fetch available capacity of the godown
      const res = await api.get(`${serverUrl.getCapacity}${user}`);
      // `${serverUrl.placeOrder}${cart2[0].customerId}`,
      console.log(res);

      // const response = await api.get(`${serverUrl.getAllSuppliers}`);
      const availableCapacity = res.data.availableCapacity;
      console.log();

      // Check if available capacity is less than total volume
      if (availableCapacity < totalVolume) {
        showMessage({
          message: "Error",
          description: "Not enough capacity available in godown.",
          type: "danger",
        });
        return;
      }

      // Prepare data in the required format
      const requestData = {
        godownId: Number(user), // Replace with the appropriate godownId
        supplierId: cart[0].supplierId, // Replace with the appropriate supplierId
        purchaseQuantity: cart.reduce(
          (total, product) => total + parseInt(product.Quantity),
          0
        ),
        totalCostPrice: calculateTotalCost(cart), // Implement calculateTotalCost function to calculate total cost
        products: cart.map((item) => ({
          productName: item.ProductName,
          purchaseQuantity: item.Quantity, // Ensure Quantity is converted to integer
          costPrice: parseFloat(item.Price), // Ensure Price is converted to float
          productVolume: parseFloat(item.productVolume), // Ensure productVolume is converted to float
          productType: parseFloat(item.productType), // Ensure productType is converted to float
          productCategory: item.Category,
        })),
      };

      // Make POST request to the API endpoint
      const response = await api.post(
        `${serverUrl.createPurchaseOrder}`,
        requestData
      );
      setCart([]);
      showMessage({
        message: "Success",
        description: "Order placed successfully",
        type: "success",
      });
      Navigation.navigate("Purchase");

      // console.log(response.data); // Log response from the API
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "An error occurred while submitting the form.");
    }
  };

  // setTotalValue(calculateTotalCost(cart));

  const calculateTotalCost = (cart) => {
    return cart.reduce((total, item) => {
      return total + parseFloat(item.Price) * parseInt(item.Quantity);
    }, 0);
  };

  useEffect(() => {
    setTotalValue(calculateTotalCost(cart));
  }, [cart]);

  const renderFooter = () => {
    return (
      <View style={styles.lastList}>
        <Text style={[styles.finalValue, {color: theme.colors.text1}]}>Total Order Value: {totalValue}</Text>
        <CustomButton
          title="Place Order"
          // loading={loading}
          onSubmit={() => placeOrder(cart)}
        />
      </View>
    );
  };

  const renderItems = ({ item }) => (
    <View style={[ {backgroundColor: theme.colors.cardBackground}]}>
      <View style={styles.itemView}>
        <View style={styles.leftContainer}>
          <Text style={[styles.nameText, {color: theme.colors.text1}]}>
            {item.ProductName}
            <Text style={styles.vol}> ({item.productVolume}m³)</Text>
          </Text>

          <Text style={[styles.priceText, {color: theme.colors.text5}]}>
            <FontAwesome name="inr" size={14} color={theme.colors.text5} />
            {item.Price}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.minusPlus}>
            <TouchableOpacity
              onPress={() => {
                decreaseQuantity(item.ProductName);
                setTotalValue((prevTotalValue) => calculateTotalCost(cart));
              }}
            >
              <Text style={[styles.btn, {backgroundColor: theme.colors.cartBtn}]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.quantity, {color: theme.colors.text1}]}>{item.Quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                increaseQuantity(item.ProductName);
                setTotalValue((prevTotalValue) => calculateTotalCost(cart));
              }}
            >
              <Text style={[styles.btn, {backgroundColor: theme.colors.cartBtn}]}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              removeFromCart(item.ProductName);
              setTotalValue(calculateTotalCost(cart));
            }}
          >
            <Text style={{color: theme.colors.text2}}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background }]}>
      <View>
        <Text style={[styles.heading, {color: theme.colors.cartBtn}]}>Cart</Text>
      </View>
      <View style={styles.cartItems}>
        <FlatList
          data={cart}
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
    flex: 1,
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
    borderRadius: 10,
    height: 100,
    borderBottomWidth: 1,
    borderColor: "rgb(228,228,227)",
  },
  vol: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: Dimensions.get("window").width > 600 ? 25:14,
  },
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
    fontSize: Dimensions.get("window").width > 600 ? 25:17,
    fontWeight: "500",
    marginBottom:5,

  },
  btn: {
    fontSize: 20,
    textAlign: "center",
    height: 30,
    width: 30,
    marginRight: 8,
    borderRadius: 10,
    color: "white",
  },

  priceText: {
    fontSize: 15,
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
  },
  headingtxt: {
    fontSize: 19,
    fontWeight: "600",
  },
 
  quantity: {
    marginRight: 10,
    top: Dimensions.get("screen").height * 0.005,
  },
  finalValue: {
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 600 ? 25:17,
  },
  lastList: {
    alignItems: "center",
    marginTop: 15,
  },
});
