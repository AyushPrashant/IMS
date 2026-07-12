import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native'
import React, { useState, useEffect,useContext } from 'react'
import { useNavigation } from "@react-navigation/native";
import {Context as UserContext} from "../../../context/UserContext";
import api from "../../../api/axiosConfig"
import serverUrl from '../../../api/urls'
import { Searchbar,useTheme } from 'react-native-paper';
import Spinner from '../../../components/Spinner';
import { FontAwesome6 } from '@expo/vector-icons';
import { capitalizeFirstLetter } from '../../../utils/utils';
const imageSource = require('../../../../assets/warehouse.png')

export default function Godowns() {
  const theme=useTheme();
  const {state} = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [godownData, setGodownData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [selectedGodown, setSelectedGodown] = useState(null);
  const Navigation = useNavigation();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {
      const response = await api.get(`${serverUrl.getAllGodown}`);
      setGodownData(response.data);
      // console.log("hello")
      // console.log("---------------------")
      // console.log(response.data);
      // console.log("---------------------")
      setLoading(false)
    } catch (error) {
      if (error.response && error.response.data === 'No Godowns Found') {
        // console.log("gfdtrfyu");
        setLoading(false)
        }
        Alert.alert('Error',  error.response.data);
      
    }
  };


  /////////////////////////////////////////////////


  const renderItems = ({ item }) => {
    const matchAddress = !searchQuery || item.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchId = !searchQuery || item.godownId.toString().toLowerCase().includes(searchQuery.toLowerCase());
    if (matchAddress || matchId) {
      return (
        <View>
            <View style={[styles.itemView,{backgroundColor: theme.colors.cardBackground}]}>
              <Image
                source={imageSource}
                style={styles.itemImage}
              />
              <View style={styles.nameView}>
                <View style={styles.priceView}>
                  <Text style={[styles.nameText,{color: theme.colors.text1}]}>ID : </Text>
                  <Text style={[styles.priceText ,{color: theme.colors.supplierId}]}>
                    {'GH0' + item.godownId}
                  </Text>

                </View>
                <View style={styles.contactContainer}>
                <Text style={[styles.priceText, {color:theme.colors.supplierDetails}]}>
                  <FontAwesome6 name="location-dot" size={15} color={theme.colors.text1} /> :{" "}
                  {capitalizeFirstLetter(item.address)}
                </Text>
              </View>

              </View>
              <View >
                <TouchableOpacity
                  onPress={() => {
                    Navigation.navigate("Godown Details", {
                      godownId: item.godownId,
                    })
                  }}>
                  <Image
                    source={
                      state.isDarkThemeOn === 'dark'                                           
                                               ? require('../../../../assets/next_White.png')
                                               : require('../../../../assets/next.png')
                                           }
                    style={styles.icon}

                  />
                </TouchableOpacity>

              </View>
            </View>


        </View>
      );
    } else {
      // Return null if the item should be filtered out
      return null;
    }
  };

  return (
    <>{
      loading ? <Spinner animating={loading} size={"large"} color={"#0BA5A4"} /> :
        (<View style={[styles.container1, {backgroundColor: theme.colors.background}]}>
          <View style={styles.topContainer}>
            <View style={styles.entries}>
              <Text style={[styles.entriesTxt,{color: theme.colors.text1}]}>Total Entries : {godownData.length} </Text>
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
            data={godownData}
            renderItem={renderItems}
            keyExtractor={(item) => item.godownId}
          />

        </View>
        )
    }
    </>

  )
}
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#fff',



  },
  itemView1: {

    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 20,
    borderRadius: 10,
    height: 60,
    justifyContent: 'space-between', // Align child elements horizontally
    alignItems: 'center', // Align child elements vertically
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
  },



  // supplier INFO

  cardBody: {
    marginTop: Dimensions.get('window').height * 0.55,
    alignItems: 'center',

  },
  card: {
    width: '98%', // Adjust the width as needed
    backgroundColor: '#fff',
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
    alignItems: 'center', // Align items in the center horizontally
    justifyContent: 'center', // Align items in the center vertically
  },
  closeButton: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: 'black',
    marginLeft: 85,
    marginRight: 85,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  container: {
    flex: 1,
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    marginTop: 10,
    borderRadius: 10,
    padding:10,

    // height: 60,
    marginBottom: 10,
    alignItems: 'center'
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
   flex:1,
    marginLeft:10,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  
  nameText: {
    fontSize: 14,
    fontWeight: '500',
  },

  priceText: {
    fontSize: 15,

  },

  icon: {
    width: 28,
    height: 28,
    

  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productInfoTxt: {
    fontWeight: 'bold',
    fontSize: 18,


  },
  productInfoValue: {
    fontSize: 18,
    color: 'green',
    fontWeight: '500',
  },
  btntext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  //////////////
  searchContainer: {
    marginTop: 10,
    marginRight: 17,
    alignItems: 'flex-end', // Aligns items (search bar) to the end of the container (to the right)
  },
  searchBar: {
    width: 180,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor:'rgb(100,105,110)',
    borderRadius:15,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align children components vertically
    justifyContent: 'space-between', // Distribute space between children components
    paddingHorizontal: 5, // Add padding horizontally
    marginBottom: 10,
  },
  entries: {
    marginTop: 20,
    marginLeft: 16,

  },
  entriesTxt: {
    fontSize: 14,
    fontWeight: '600',

  }


  /////////////////

})