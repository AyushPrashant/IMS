import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import HistoryScreen from "../screens/HistoryScreen/HistoryScreen";
import SupplierScreen from "../screens/SupplierScreen/SupplierScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import AdminScreen from "../screens/AdminScreen/AdminScreen";
import ForgotPasswordScreen from "../screens/LoginScreen/ForgotPasswordScreen";
import Purchase from "../screens/HistoryScreen/Components/Purchase";
import CartScreen2 from "../screens/AddDeliveryOrderScreen/CartScreen2";
import Delivery from "../screens/HistoryScreen/Components/Delivery";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AddDeliveryOrderScreen from "../screens/AddDeliveryOrderScreen/AddDeliveryOrderScreen";
import GodownDetails from "../screens/GodownScreen/GodownDetails";
import PurchaseDetails from "../screens/HistoryScreen/PurchaseDetails";
import OTPVerificationScreen from "../screens/LoginScreen/OTPVerificationScreen";
import AddSupplier from "../screens/SupplierScreen/AddSupplier";
import AddPurchaseOrderScreen from "../screens/AddPurchaseOrderScreen/AddPurchaseOrderScreen";

import ChangePasswordScreen from "../screens/ChangePasswordScreen/ChangePasswordScreen";
import ResetPasswordScreen from "../screens/LoginScreen/ResetPasswordScreen";
import EditProfileScreen from "../screens/EditProfileScreen/EditProfileScreen";
import ProductListScreen from "../screens/ProductListScreen/ProductListScreen";
import CustomerScreen from "../screens/CustomerScreen/CustomerScreen";
import GodownScreen from "../screens/GodownScreen/GodownScreen";
import React from "react";
import AddProducts from "../screens/ProductListScreen/AddProduct";
import { Context as UserContext } from "../context/UserContext";
import DeliveryOrderBill from "../screens/HistoryScreen/Components/DeliveryOrderBill";

import AddCustomer from "../screens/CustomerScreen/AddCustomer";
import AddGodown from "../screens/GodownScreen/AddGodown";
import AddGodownHead from "../screens/GodownScreen/AddGodownhead";
import UpdateCustomer from "../screens/CustomerScreen/UpdateCustomer";
import UpdateSupplier from "../screens/SupplierScreen/UpdateSupplier";
import UpdateProduct from "../screens/ProductListScreen/UpdateProduct";

import CartScreen from "../screens/AddPurchaseOrderScreen/CartScreen";
import LoginWithOTPScreen from "../screens/LoginScreen/LoginWithOTPScreen";
import { Platform, StatusBar } from 'react-native';
import { useTheme } from "react-native-paper";

const Stack = createStackNavigator();

const BottomStack = createMaterialBottomTabNavigator();
const statusBarHeight = StatusBar.currentHeight || 0;

// Calculate the height of the home indicator for iPhone X and newer models
const homeIndicatorHeight = Platform.OS === 'ios' ? (34 + (statusBarHeight - 20)) : 0;

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}

      />
      <Stack.Screen
        name="OtpVerification"
        component={OTPVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}

      />
      <Stack.Screen
        name="LoginWithOTP"
        component={LoginWithOTPScreen}
        options={{ headerShown: false }}

      />
      <Stack.Screen name="IMS" component={AppBottomStack} options={{ headerShown: false }} />
    </Stack.Navigator>

  );
};


const AppBottomStack = () => {
  const { role } = useContext(AuthContext);
  const theme = useTheme();
  const { state } = useContext(UserContext)

  // console.log("navigation : "+role);
  return (
    <BottomStack.Navigator
      // shifting={true} 

      barStyle={{ backgroundColor: theme.colors.cardBackground, height: 70, borderTopWidth: state.isDarkThemeOn === 'dark' ? 0 : 1, borderColor: theme.colors.lineseparator, marginBottom: homeIndicatorHeight }}
      activeColor={state.isDarkThemeOn === 'dark' ? '#E8EDF2' : '#121B22'}

      inactiveColor={state.isDarkThemeOn === 'dark' ? '#84929C' : '#54656F'}
      theme={{ colors: { secondaryContainer: theme.colors.secContainer } }}
    >

      <BottomStack.Screen
        name="Home"
        component={role == "admin" ? AdminScreen : HomeScreen}
        // component={AdminScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (

            <Ionicons name="home" color={color} size={20} />
          ),
        }}
      />


      <BottomStack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={24} />
          ),
        }}
      />
      {/* <BottomStack.Screen
                name="Supplier"
                component={SupplierScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="truck-cargo-container"
                            color={color}
                            size={20}
                        />
                    ),
                }}
            /> */}
      <BottomStack.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={color} size={24} />
          ),
        }}
      />
    </BottomStack.Navigator>
  );
};

const ProfileStack = () => {
  const { state } = useContext(UserContext)
  const theme = useTheme();
  return (
    <Stack.Navigator >
      <Stack.Screen name="Profile Screen" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} 
      options={{
        headerStyle: {
          backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

        },
        headerTitleStyle: {
          color: 'white'
        },
        headerBackTitleVisible: false,
        headerTintColor: 'white'
      }}
      />
      <Stack.Screen name="Change Password" component={ChangePasswordScreen} 
      options={{
        headerStyle: {
          backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

        },
        headerTitleStyle: {
          color: 'white'
        },
        headerBackTitleVisible: false,
        headerTintColor: 'white'
      }}
      />
    </Stack.Navigator>
  );

}



const NavigationFlow = ({ navigation }) => {

  const { auth } = useContext(AuthContext);
  const { state } = useContext(UserContext)
  const theme = useTheme();


  return (
    <NavigationContainer >
      <Stack.Navigator options={{ headerShown: false }} >
        {!auth ? <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} /> : <Stack.Screen name="IMS" component={AppBottomStack} options={{ headerShown: false }} />}
        <Stack.Screen name="Add Supplier" component={AddSupplier}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Add Customer" component={AddCustomer}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />


        <Stack.Screen name="Supplier" component={SupplierScreen} options={{
          headerStyle: {
            backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

          },
          headerTitleStyle: {
            color: 'white'
          },
          headerBackTitleVisible: false,
          headerTintColor: 'white'

        }} />
        <Stack.Screen name="Product" component={ProductListScreen}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Invoice" component={DeliveryOrderBill}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Purchase Details" component={PurchaseDetails}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark'? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Update Customer" component={UpdateCustomer}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Update Supplier" component={UpdateSupplier}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Update Product" component={UpdateProduct}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Add Product" component={AddProducts}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Purchase Order" component={AddPurchaseOrderScreen}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark'? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Add Delivery Order" component={AddDeliveryOrderScreen}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        {/* <Stack.Screen name="Add D/O" component={ProductListScreen} /> */}
        <Stack.Screen name="Add Godown" component={AddGodown}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Add Godownhead" component={AddGodownHead}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Checkout" component={CartScreen}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Cart" component={CartScreen2}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Godown" component={GodownScreen}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn  === 'dark'? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Customer" component={CustomerScreen}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn  === 'dark'? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Godown Details" component={GodownDetails}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark'? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Purchase" component={Purchase}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark'? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="Delivery" component={Delivery}
          options={{
            headerStyle: {
              backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer

            },
            headerTitleStyle: {
              color: 'white'
            },
            headerBackTitleVisible: false,
            headerTintColor: 'white'
          }}
        />


      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default NavigationFlow;
