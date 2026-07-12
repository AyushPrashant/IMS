import Container from "../../components/Container";
import { Dimensions, StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import {
  useTheme
} from "react-native-paper";
import CustomTextInput from "../../components/TextInput";
import CustomButton from "../../components/Button";
import { useNavigation} from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import api from "../../api/axiosConfig";
import serverUrl from "../../api/urls";
import { Dropdown } from "react-native-element-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../../context/CartContext";


const AddDeliveryOrderScreen = ({ route }) => {
  // console.log(route.params.customerId);
  const theme = useTheme();
  const Navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const { addToCart2 } = useCart();
  const { itemCount2 } = useCart();
  const { id2 } = useCart();
  const [GodownId, setGodownId] = useState("");
  const getProducts = async () => {
    try {
      const response = await api.get(`${serverUrl.singleProduct}`);

      if (response.data.length === 0) {
        // Handle case where no products are returned
        // console.log("No products found.");
        return;
      }
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString).godownId;
      setGodownId(user);
      const dropdownItems = response.data.map(product => ({
        label: product[0],
        value: product[0], // Assuming the product name is also the value
      }));


      setItems(dropdownItems);
    } catch (error) {
      // console.error("Error fetching data:" + error);
      Alert.alert('Error', 'An error occurred while submitting the form.');

    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await getProducts(); // Wait for getSuppliers to complete
    };

    fetchData();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    const tax = (0.18 * (data.SellPrice));
    const trimmedData = {
      ...data,
      ProductName: data.Product.value.trim(),
      SellPrice: data.SellPrice.trim(),
      Quantity: data.Quantity.trim(),
      godownId: GodownId,
      taxPercentage: 18,
      tax: tax,
      customerId: route.params.customerId
    };

    addToCart2(trimmedData);

    // setLoading(true);
    // updateUser(trimmedData)
    //   .then((response) => {
    //     navigation.goBack();
    //     showMessage({
    //       message: "Success",
    //       description: response,
    //       type: "success",
    //     });
    //   })
    //   .catch((error) => {
    //     showMessage({
    //       message: "Failed",
    //       description: error,
    //       type: "danger",
    //     });
    //   })
    //   .finally(() => setLoading(false));
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={[styles.container, {backgroundColor:theme.colors.background}]}>
      <View style={styles.formContainer}>
        <Container>
          <Controller
            name="Product" // The name of the field in the form
            control={control} // The form control object from useForm
            render={({ field }) => (
              <Dropdown
                label="Select Product"
                placeholder="Select Product"
                placeholderStyle = {{color:theme.colors.borderColor}}
                data={items}
                value={selectedValue}
                onChange={(item) => setSelectedValue(item.value)}
                style={{
                  borderColor: theme.colors.borderColor,
                  borderWidth: 0.25,
                  borderRadius: Dimensions.get("window").width > 600 ? 4: 15,
                  marginBottom: Dimensions.get("window").width > 600 ? 15:12,
                  width: Dimensions.get("window").width > 600 ? "80%":"100%",
                  alignSelf:"center",
                  height: 50,
                  paddingLeft: "5%",
                  paddingRight: "5%",

                }}
                labelField="label"
                valueField="value"
                activeColor='no'
                selectedTextStyle={{color:theme.colors.borderColor}}
                containerStyle={{borderRadius:3,backgroundColor:theme.colors.background}}
                itemTextStyle={{color:theme.colors.text1}}
                icon={"package"}
                error={errors.ProductName && errors.ProductName.message}
                {...field} // Spread the field props provided by Controller
              />
            )}
          />

          <Controller
            control={control}
            name="SellPrice"
            rules={{
              required: 'Price is required',
              pattern: {
                value: /^\d+$/,
                message: 'Numbers only'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Sell Price"}
                placeholder={"Enter SellPrice"}
                value={value}
                error={errors.SellPrice && errors.SellPrice.message}
                keyboardType={"numeric"}
                secureTextEntry={false}
                onChangeText={(value) => onChange(value)}
                icon={"currency-rupee"}
                position={"left"}
              />
            )}
            
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Quantity"}
                placeholder={"Enter Product Quantity"}
                value={value}
                keyboardType={"numeric"}
                secureTextEntry={false}
                onChangeText={(value) => onChange(value)}
                error={errors.Quantity && errors.Quantity.message}
                icon={"package-variant"}
                position={"left"}
              />
            )}
            name="Quantity"
            rules={{ required: "Quantity is required" }}
          />

          <CustomButton
            title="Add to cart"
            // loading={loading}
            onSubmit={handleSubmit(onSubmit)}
          />
          <TouchableOpacity
            onPress={() => {
              Navigation.navigate("Cart");
            }}
          >
            <CustomButton
              title={`Go to cart(${itemCount2})`}
              style={styles.btn}
              // loading={loading}
            />

          </TouchableOpacity>

          {/* <View style={styles.icon}>
            
              <AntDesign name="shoppingcart" size={24} color="black" />
              {itemCount2 > 0 && (
                <Text style={styles.itemCount}>{itemCount2}</Text>
              )}
            
          </View> */}
        </Container>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
  },

  formContainer: {
    width: Dimensions.get("window").width * 1,
  },
  icon: {
    flex: 1,
    alignItems: "center",
  },
  itemCount: {
    textAlign: "center",
  },
});

export default AddDeliveryOrderScreen;
