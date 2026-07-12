import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useContext } from "react";
import api from "../../../api/axiosConfig";
import serverUrl from "../../../api/urls";
import { Searchbar,useTheme } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../../context/authContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "../../../components/Spinner";
import { Entypo } from "@expo/vector-icons";

const imageSource = require('../../../../assets/inverter.png')

export default function Products() {
  const navigation = useNavigation();
  const theme=useTheme()
  const [searchQuery, setSearchQuery] = useState("");
  const { role } = useContext(AuthContext);

  // const [userRole, setUserRole] = useState('');
  // const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to send data to parent component

  //////////////////////////////////////////////////////////
  // API FETCHING CODE //

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchData();

  //   }, [userRole])
  // );

  // useEffect(() => {
  //   if (userRole !== '') {
  //     fetchData();
  //   }
  // }, [userRole]);

  // useEffect(() => {
  //   fetchData();

  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const [productData, setProductData] = useState([]);
  const fetchData = async () => {
    const userString = await AsyncStorage.getItem("user");

    const user = JSON.parse(userString);

    // const role = user.role;
    const godownId = user.godownId;
    // setUserRole(role);
    try {
      let url = "";
    

      if (role === "admin") {
        url = serverUrl.getAllProducts;
      } else {
        url = serverUrl.getGodownProducts + godownId;
      }

      const response = await api.get(url);

      setProductData(response.data);

      setLoading(false);
    } catch (error) {
      if (error.response.data || error.response === "Product List is Empty") {
        setLoading(false);
      }
    }
  };

  const renderIconContainer = (item) => {
    if (role === "godownhead") {
      return (
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => {
              // Handle icon press
              navigation.navigate("Update Product", { productData: item });
              // console.log(item)
            }}
          >
            <Image
              source={require("../../../../assets/info.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  /////////////////////////////////////////////////

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const renderItems = ({ item }) => {
    if (
      !searchQuery ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return (
        <TouchableOpacity
          styles={styles.mainContainer}
          activeOpacity={0.1}
          onPress={() => {
            setModalVisible(true);
            setSelectedProduct(item);
          }}
        >
          <View style={[styles.itemView,{backgroundColor: theme.colors.productcardBackground}]}>
            <View style={{ justifyContent: "center", marginLeft: 5 }}>
              <Image source={imageSource} style={styles.itemImage} />
            </View>

              <View style={styles.nameView}>
                <Text style={[styles.nameText,{color: theme.colors.text1}]}>{item.productName}</Text>
                <Text style={[styles.descText,{color: theme.colors.text1}]}>{'Quantity : ' + item.totalQuantity}</Text>
                <Text style={styles.priceText}>
                    {'₹' + item.price}
                  </Text>
              </View>

              
              
            
              {renderIconContainer(item)}
            
            </View>
        </TouchableOpacity>
      );
    } else {
      // Return null if the item should be filtered out
      return null;
    }
  };

  return (
    <>
      {loading ? (
        <Spinner animating={loading} size={"large"} color={"#0BA5A4"} />
      ) : (
        <View style={[styles.container1,{color: theme.colors.background},{backgroundColor: theme.colors.background}]}>
          <View style={styles.topContainer}>
            <View style={styles.entries}>
              <Text style={[styles.entriesTxt,{color: theme.colors.text1}]}>
                Total Entries : {productData.length}{" "}
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

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalcontainer}>
                <View>
                  <TouchableOpacity
                    style={styles.closeIconContainer}
                    onPress={() => setModalVisible(false)}
                  >
                    <Entypo name="cross" size={24} color={theme.colors.text1} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.tablecontainer,{backgroundColor: theme.colors.modalBackground}]}>
                  <View style={{justifyContent:"center"}}>
                    <Text style={[styles.details,{color: theme.colors.text1}]}>Product Details</Text>
                  </View>

                  {/* <View style={styles.thead}>
                      <Text style={styles.theadfeild}>FIELD</Text>
                      <Text style={styles.theadfeild}>VALUE</Text>

                    </View> */}
                    <View style={{backgroundColor:theme.colors.modalBackground}}>
                  <View style={[styles.trow1,{backgroundColor: theme.colors.modalBackground}]}>
                    <Text style={[styles.tfeild,{color: theme.colors.text1}]}>ID</Text>
                    <Text style={styles.tvalue}>
                      {selectedProduct ? selectedProduct.productId : ""}
                    </Text>
                  </View>
                  <View style={[styles.trow2,{backgroundColor: theme.colors.modalBackground}]}>
                    <Text style={[styles.tfeild,{color: theme.colors.text1}]}>Name</Text>
                    <Text style={styles.tvalue}>
                      {selectedProduct ? selectedProduct.productName : ""}
                    </Text>
                  </View>
                  <View style={[styles.trow1,{backgroundColor: theme.colors.modalBackground}]}>
                    <Text style={[styles.tfeild,{color: theme.colors.text1}]}>Godown Id</Text>
                    <Text style={styles.tvalue}>
                      {selectedProduct ? selectedProduct.godownId : ""}
                    </Text>
                  </View>
                  <View style={[styles.trow2,{backgroundColor: theme.colors.modalBackground}]}>
                    <Text style={[styles.tfeild,{color: theme.colors.text1}]}>Product Volume</Text>
                    <Text style={styles.tvalue}>
                      {selectedProduct ? selectedProduct.productVolume : ""}
                    </Text>
                  </View>
                  <View style={[styles.trow1,{backgroundColor: theme.colors.modalBackground}]}>
                    <Text style={[styles.tfeild,{color: theme.colors.text1}]}>Product Type</Text>
                    <Text style={styles.tvalue}>
                      {selectedProduct ? selectedProduct.productType : ""} KW
                    </Text>
                  </View>
                  <View style={[styles.trow2,{backgroundColor: theme.colors.modalBackground}]}>
                    <Text style={[styles.tfeild,{color: theme.colors.text1}]}>Category</Text>
                    <Text style={styles.tvalue}>
                      {selectedProduct ? selectedProduct.productCategory : ""}
                    </Text>
                  </View>
                  <View style={[styles.trow1,{backgroundColor: theme.colors.modalBackground}]}>
                    <Text style={[styles.tfeild,{color: theme.colors.text1}]}>Total Quantity</Text>
                    <Text style={styles.tvalue}>
                      {selectedProduct ? selectedProduct.totalQuantity : ""}
                    </Text>
                  </View>
                  <View style={[styles.trow2,{backgroundColor: theme.colors.modalBackground}]}>
                    <Text style={[styles.tfeild,{color: theme.colors.text1}]}>Price</Text>
                    <Text style={styles.tvalue}>
                      ₹{selectedProduct ? selectedProduct.price : ""}
                    </Text>
                  </View>
                  </View>
                  {/* <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.closeButton} >
                      <Text style={styles.btntext}>Close</Text>
                    </TouchableOpacity> */}
                  {/* <CustomButton title={"Close"}  /> */}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <FlatList
            data={productData}
            renderItem={renderItems}
            keyExtractor={(item) => item.productId.toString()}
          />
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container1: {
    flex: 1,
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

  // Product INFO

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
    backgroundColor: "white",
    marginLeft: 95,
    marginRight: 95,
    borderWidth: 0.7,
    borderColor: "rgb(100,105,110)",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  btntext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  // container: {
  //   flex: 1,
  // },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    flex: 1,
    borderWidth: 1,
    borderColor:"rgb(100,105,110)",
    paddingRight:25,


  },
  itemImage: {
    width: 35,
    height: 35,

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
    color: 'green',
   
  

  },

  icon: {
    width: 28,
    height: 28,
  },
  iconContainer: {
    justifyContent: "center",
  },
  descText: {
    fontSize: 14,
    color: "rgb(100,105,110)",
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
  mainContainer: {
    flex: 1,
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
    // height:Dimensions.get('window').height*0.55,
    width: "100%",
    borderRadius: 15,
    paddingVertical: Dimensions.get("window").height * 0.03,
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
    paddingVertical: Dimensions.get("window").height * 0.01,
  },
  trow2: {
    flexDirection: "row",
    justifyContent: "space-between", // Places the first text at the start and the second text at the end
    paddingHorizontal: 30,
    backgroundColor: "rgb(249,250,251)",
    paddingVertical: Dimensions.get("window").height * 0.01,
  },
  theadfeild: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tfeild: {},
  tvalue: {
    color: "rgb(140,140,140)",
  },
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
    marginBottom: 10,
  },
  entries: {
    marginTop: 20,
    marginLeft: 16,
  },
  entriesTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeIconContainer: {
    position: "absolute",
    marginTop: Dimensions.get("window").width > 600 ? Dimensions.get("window").height*0.01 : Dimensions.get("window").height * 0.033,
    marginLeft:Dimensions.get("window").width > 600 ? Dimensions.get("window").width*0.4 : Dimensions.get("window").width * 0.34,
    // right: 15,
    zIndex: 1,
    // justifyContent: "center"
  },
  details: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    // position:"absolute",
    zIndex: 1,
    bottom:Dimensions.get("window").width > 600?  Dimensions.get("window").width*0.03 : 0,
    // marginLeft:100,
    paddingBottom: Dimensions.get("window").height * 0.01,
  },
});
