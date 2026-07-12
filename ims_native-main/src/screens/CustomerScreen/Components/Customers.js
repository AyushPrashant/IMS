import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import {Context as UserContext} from "../../../context/UserContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../../../api/axiosConfig";
import serverUrl from "../../../api/urls";
import { Searchbar,useTheme } from "react-native-paper";
const imageSource = require("../../../../assets/customer.png");
import { FontAwesome } from "@expo/vector-icons";
import { useCart } from "../../../context/CartContext";
import Spinner from "../../../components/Spinner";
import { capitalizeFirstLetter } from "../../../utils/utils";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
export default function Customers() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const theme=useTheme()
  const [searchQuery, setSearchQuery] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const {state} = useContext(UserContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { clearCart, cart2 } = useCart();
  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // console.log("api response: " + cart2);
      fetchData();
      clearCart();
      // console.log(cart2);
    }, [])
  );
  const fetchData = async () => {
    try {
      const response = await api.get(`${serverUrl.getAllCustomers}`);
      setCustomerData(response.data);
      setLoading(false);
    } catch (error) {
    }
  };

  /////////////////////////////////////////////////

  const [modalVisible, setModalVisible] = useState(false);
  const renderItems = ({ item }) => {
    const matchName =
      !searchQuery ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchId =
      !searchQuery ||
      item.customerId
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchNumber =
      !searchQuery ||
      item.customerNo
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchAddress =
      !searchQuery ||
      item.customerAddress
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    if (matchName || matchId || matchNumber || matchAddress) {
      return (
        //           <TouchableOpacity
        //           onPress={() => {
        //             setModalVisible(true);
        //             setSelectedCustomer(item);
        //           }}>
        // <View>

        //         <View style={styles.itemView}>
        //               <Image
        //                 source={imageSource}
        //                 style={styles.itemImage}
        //               />
        //               <View style={styles.nameView}>
        //                 <Text style={styles.nameText}>{item.customerName}</Text>

        //                 <View style={styles.priceView}>
        //                   <Text style={styles.priceText}>
        //                     {'ID : ' + item.customerId}
        //                   </Text>

        //                 </View>
        //               </View>
        //               <View >
        //                 <TouchableOpacity
        //                 onPress={() => {

        //                 }}>
        //                   <Image
        //                     source={require('../../../../assets/info.png')}
        //                     style={styles.icon}

        //                   />
        //                 </TouchableOpacity>

        //               </View>
        //             </View>

        // </View>
        // </TouchableOpacity>
        <View style={[styles.fContainer,{backgroundColor: theme.colors.cardBackground}]}>
          <View >
            <Image source={imageSource} style={styles.itemImage} />
          </View>
          <View style={styles.suppInfo}>
            <View style={styles.nameContainer}>
              <Text style={[styles.nameText,{color: theme.colors.text1}]}>{capitalizeFirstLetter(item.customerName)}</Text>
            </View>

            <View style={styles.idContainer}>
              <Text style={[styles.priceText, { color: theme.colors.supplierId }]}>
                <Text style={[styles.nameText,{color: theme.colors.text1}]}>ID</Text>
                {" : CUST" + item.customerId}
              </Text>
            </View>
            <View style={styles.contactContainer}>
              <Text style={[styles.priceText, {color:theme.colors.supplierDetails}] }>
                <FontAwesome name="phone" size={15} color={theme.colors.text1} /> :{" "}
                {item.customerNo}
              </Text>
            </View>
            <View style={styles.contactContainer}>
              <Text style={[styles.priceText,  {color:theme.colors.supplierDetails}]}>
                <FontAwesome6 name="location-dot" size={15} color={theme.colors.text1} /> :{" "}
                {item.customerAddress}
              </Text>
            </View>
          </View>
          <View style={{marginRight:15,}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Add Delivery Order", {
                  customerId: item.customerId,
                  customerName: item.customerName,
                  customerAddress: item.customerAddress,
                  customerNo: item.customerNo,
                });
              }}
              style={{
                marginBottom: Dimensions.get("window").height * 0.05,
                marginLeft: -5,
              }}
            >
              <FontAwesome5 name="cart-plus" size={28} color={theme.colors.text1}/>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Update Customer", { customerData: item });
              }}
            >
              <Image
                source={
                    state.isDarkThemeOn === 'dark'                                           
                                             ? require('../../../../assets/info_White.png')
                                             : require('../../../../assets/info.png')
                                         }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // Return null if the item should be filtered out
      return null;
    }
  };

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      {loading ? (
        <Spinner animating={loading} size={"large"} color={"#0BA5A4"} />
      ) : (
        <View style={[styles.container1, {backgroundColor: theme.colors.background}]}>
          <View style={styles.topContainer}>
            <View style={styles.entries}>
              <Text style={[styles.entriesTxt,{color: theme.colors.text1}]}>
                Total Entries : {customerData.length}{" "}
              </Text>
            </View>
            {/* search bar  */}
            <View style={styles.searchContainer}>
              <Searchbar
                style={[styles.searchBar,{backgroundColor: theme.colors.cardBackground}]}
                placeholder="Search"
                onChangeText={setSearchQuery}
                value={searchQuery}
              />
            </View>
            {/* /////////////////// */}
          </View>

          <FlatList
            data={customerData}
            renderItem={renderItems}
            keyExtractor={(item) => item.customerId}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container1: {
    flex:1,
    paddingBottom: 80,

    backgroundColor: "#fff",
  },
  itemView1: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 20,
    borderRadius: 10,
    height: 60,
    justifyContent: "space-between", // Align child elements horizontally
    alignItems: "center", // Align child elements vertically
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
  },

  // supplier INFO

  cardBody: {
    marginTop: Dimensions.get("window").height * 0.55,
    alignItems: "center",
  },
  card: {
    width: "98%", // Adjust the width as needed
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  cardContent: {
    marginTop: 20, // Make the card title bold
  },
  image: {
    width: 150, // Adjust the width and height as needed
    height: 150,
    borderRadius: 10, // Assuming it's a circular image
  },
  imageContainer: {
    alignItems: "center", // Align items in the center horizontally
    justifyContent: "center", // Align items in the center vertically
  },
  closeButton: {
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "black",
    marginLeft: 85,
    marginRight: 85,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  container: {
    flex: 1,
  },
  itemView: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    elevation: 4,
   
    borderRadius: 10,
    height: 60,
    marginBottom: 10,
    alignItems: "center",
  },
  itemImage: {
    width: 40,
    height: 40,

    margin: 5,
  },
  nameView: {
    width: "69%",
    margin: 10,
  },
  priceView: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 17,
    fontWeight: "500",
  },

  priceText: {
    fontSize: 15,
    color: "rgb(100,105,110)",
  },

  icon: {
    width: 28,
    height: 28,
  },
  descText: {
    fontSize: 14,
    fontWeight: "600",
  },
  productInfoTxt: {
    fontWeight: "bold",
    fontSize: 18,
  },
  productInfoValue: {
    fontSize: 18,
    color: "green",
    fontWeight: "500",
  },
  btntext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },

  //TABLE DESIGNS
  modalcontainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingLeft: Dimensions.get("window").width * 0.05,
    paddingRight: Dimensions.get("window").width * 0.05,
  },
  tablecontainer: {
    backgroundColor: "#fff",
    height: 310,
    width: "100%",
    borderRadius: 15,
    paddingTop: 26,
  },
  thead: {
    flexDirection: "row",
    justifyContent: "space-between", // Places the first text at the start and the second text at the end
    paddingHorizontal: 30,
    backgroundColor: "rgb(249,250,251)",

    paddingTop: 10,
    paddingBottom: 10,
  },
  trow1: {
    flexDirection: "row",
    justifyContent: "space-between", // Places the first text at the start and the second text at the end
    paddingHorizontal: 30,
    backgroundColor: "rgb(255,255,255)",
    paddingTop: 10,
    paddingBottom: 10,
  },
  trow2: {
    flexDirection: "row",
    justifyContent: "space-between", // Places the first text at the start and the second text at the end
    paddingHorizontal: 30,
    backgroundColor: "rgb(249,250,251)",
    paddingTop: 10,
    paddingBottom: 10,
  },
  theadfeild: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tfeild: {},
  tvalue: {
    color: "rgb(140,140,140)",
  },
  /////////////////
  searchContainer: {
    marginTop: 10,
    marginRight: 17,
    alignItems: "flex-end", // Aligns items (search bar) to the end of the container (to the right)
  },
  searchBar: {
    width: 180,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgb(100,105,110)",
    borderRadius: 15,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center", // Align children components vertically
    justifyContent: "space-between", // Distribute space between children components
    paddingHorizontal: 5, // Add padding horizontally
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgb(228,228,227)',
  },
  entries: {
    marginTop: 20,
    marginLeft: 16,
  },
  entriesTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  fContainer: {

    // height: Dimensions.get('window').height * 0.19,
    borderBottomWidth: 1,
    borderColor: 'rgb(228,228,227)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
   
    // borderTopWidth:2
  },
  suppInfo: {
   flex:1,
    padding: 10, // Add padding to the entire container
  },
  nameContainer: {
    marginBottom: 10, // Add vertical margin between name and other elements
  },
  idContainer: {
    marginBottom: 10, // Add vertical margin between ID and other elements
  },
  contactContainer: {
    marginBottom: 10, // Add vertical margin between contact and other elements
  },
});
