import Container from "../../components/Container";
import { Dimensions, StyleSheet, View } from "react-native";
import { useContext, useState, useEffect } from "react";
import CustomTextInput from "../../components/TextInput";
import { useTheme } from "react-native-paper";
import CustomButton from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { Context as UserContext } from "../../context/UserContext";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import api from "../../api/axiosConfig";
import serverUrl from "../../api/urls";
import { Dropdown } from "react-native-element-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../../context/CartContext";

const AddPurchaseOrderScreen = () => {
  const [loading, setLoading] = useState(false);
  const Navigation = useNavigation();
  const theme = useTheme();
  const { state, updateUser } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");
  const { addToCart, itemCount, cart, id } = useCart();
  const [GodownId, setGodownId] = useState("");
  const [isDropdownEnabled, setisDropdownEnabled] = useState(true);

  const dummyData = [
    { label: "2 KW", value: "2 KW" },
    { label: "3.3 KW", value: "3.3 KW" },
    { label: "5 KW", value: "5 KW" },
    { label: "8 KW", value: "8 KW" },
    { label: "12 KW", value: "12 KW" },
    // Add more dummy data as needed
  ];

  const getSuppliers = async () => {
    try {
      // console.log("----------r");
      const response = await api.get(`${serverUrl.getAllSuppliers}`);
      // console.log(response);
      // console.log("_________________");
      const dropdownItems = response.data.map((supplier, index) => ({
        label: supplier.supplierName,
        value: supplier.supplierId, // Assuming each godown has an id
      }));
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString).godownId;
      setGodownId(user);
      // console.log(userString);

      setItems(dropdownItems);
    } catch (error) {
      console.error("Error fetching data:" + error);
    }
    // console.log(items);
  };

  const handleDropdownChange = (cart) => {
    if (cart.length === 0) {
      setisDropdownEnabled(true);
    } else {
      setisDropdownEnabled(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSuppliers(); // Wait for getSuppliers to complete
    };

    fetchData();
    handleDropdownChange(cart);
  }, [cart]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    const trimmedData = {
      ...data,
      supplier: data.supplier.label,
      supplierId: data.supplier.value,
      ProductName: data.ProductName.trim(),
      productVolume: data.productVolume.trim(),
      Price: data.Price.trim(),
      Quantity: data.Quantity.trim(),
      Category: data.Category.trim(),
      productType: data.productType.label,
      godownId: GodownId,
    };
    addToCart(trimmedData);

  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={[styles.container, {backgroundColor:theme.colors.background}]}>
      <View style={styles.formContainer}>
        <Container>
          <Controller
            name="supplier" // The name of the field in the form
            control={control} // The form control object from useForm
            render={({ field }) => (
              <Dropdown
                label="Select Supplier"
                placeholder="Select Supplier"
                placeholderStyle = {{color:theme.colors.borderColor}}
                data={items}
                value={selectedValue}
                onChange={(item) => setSelectedValue(item.value)}
                style={{
                  borderColor: theme.colors.borderColor,
                  borderWidth: 0.25,
                  borderRadius: 6,
                  height: 50,
                  borderRadius: Dimensions.get("window").width > 600 ? 4: 15,
                  marginBottom: Dimensions.get("window").width > 600 ? 15:12,
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  width:Dimensions.get("window").width > 600 ? "80%":"100%",
                  alignSelf:'center',
                  backgroundColor: theme.colors.background,
                }}
                enabled={isDropdownEnabled}
                containerStyle={{borderRadius:3,backgroundColor:theme.colors.background, }}
                itemTextStyle={{color:theme.colors.text1}}
                selectedTextStyle={{color:theme.colors.borderColor}}
                labelField="label"
                valueField="value"
                error={errors.ProductName && errors.ProductName.message}
                {...field} // Spread the field props provided by Controller
              />
            )}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Product Name"}
                placeholder={"Enter Product Name"}
                value={value}
                keyboardType={"default"}
                secureTextEntry={false}
                onChangeText={(value) => onChange(value)}
                error={errors.ProductName && errors.ProductName.message}
                icon={"package"}
                position={"left"}
              />
            )}
            name="ProductName"
            rules={{
              required: "Product Name is required",
            }}
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Product Volume"}
                placeholder={"Enter Product Volume"}
                value={value}
                keyboardType={"numeric"}
                secureTextEntry={false}
                onChangeText={(value) => onChange(value)}
                error={errors.productVolume && errors.productVolume.message}
                icon={"package-variant"}
                position={"left"}
              />
            )}
            name="productVolume"
            rules={{
              required: "Product Volume is required",
            }}
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Price"}
                placeholder={"Enter Price"}
                value={value}
                keyboardType={"numeric"}
                secureTextEntry={false}
                onChangeText={(value) => onChange(value)}
                error={errors.Price && errors.Price.message}
                icon={"currency-rupee"}
                position={"left"}
              />
            )}
            name="Price"
            rules={{
              required: 'Price is required',
              pattern: {
                value: /^\d+$/,
                message: 'Numbers only'
              }
            }}
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
                onChangeText={(text) => {
                  // Positive value check
                  const numericValue = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                  onChange(numericValue);
                }}
                error={errors.Quantity && errors.Quantity.message}
                icon={"package-variant"}
                position={"left"}
              />
            )}
            name="Quantity"
            rules={{ required: "Quantity is required" }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Product Category"}
                placeholder={"Enter Product Category"}
                value={value}
                keyboardType={"default"}
                secureTextEntry={false}
                onChangeText={(value) => onChange(value)}
                error={errors.Category && errors.Category.message}
                icon={"package-variant"}
                position={"left"}
              />
            )}
            name="Category"
            rules={{ required: "Category is required" }}
          />

          <Controller
            name="productType" // The name of the field in the form
            control={control} // The form control object from useForm
            render={({ field }) => (
              <Dropdown
                label="Select Product Type"
                placeholder="Select Product Type"
                placeholderStyle = {{color:theme.colors.borderColor}}
                data={dummyData}
                value={selectedValue2}
                onChange={(item) => setSelectedValue2(item.value)}
                style={{
                  borderColor: theme.colors.borderColor,
                  borderWidth: 0.25,
                  borderRadius: 6,
                  width:Dimensions.get("window").width > 600 ? "80%":"100%",
                  alignSelf:'center',
                  borderRadius: Dimensions.get("window").width > 600 ? 4: 15,
                  marginBottom: Dimensions.get("window").width > 600 ? 15:12,
                  height: 47,
                  marginTop: 9,
                  paddingLeft: "5%",
                  paddingRight: "5%",
                }}
                labelField="label"
                valueField="value"
                activeColor='no'
                selectedTextStyle={{color:theme.colors.borderColor}}
                containerStyle={{borderRadius:3,backgroundColor:theme.colors.background}}
                itemTextStyle={{color:theme.colors.text1}}
                {...field} // Spread the field props provided by Controller
              />
            )}
          />

          <CustomButton
            title="Add to cart"
            loading={loading}
            onSubmit={handleSubmit(onSubmit)}
          />

          <TouchableOpacity
              onPress={() => {
                Navigation.navigate("Checkout");
              }}
            >
          <CustomButton
            title={`Go to cart(${itemCount})`}
            loading={loading}
            
          />
          </TouchableOpacity>
          {/* {cart.map((item, index) => (
            <Text key={index}>{item.productName}</Text>
          ))} */}

          {/* <CartIcon /> */}
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

export default AddPurchaseOrderScreen;
