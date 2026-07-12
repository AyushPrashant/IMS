import { View, StyleSheet,Dimensions,FlatList } from 'react-native'
import React, {useState,useEffect} from 'react'

import api from "../../../api/axiosConfig"
import serverUrl from '../../../api/urls'
import { useNavigation } from '@react-navigation/native';
import { Card ,Text, useTheme} from 'react-native-paper';
import { Grid } from '../../../components/GlobalStyle';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../../../components/Spinner';

const imageSource = require('../../../../assets/delivery.png')

const NotFoundComponent = () => {
  return (
    <View style={styles.notFoundText}>
            <Text variant="bodyMedium">No Orders Found</Text>
      </View>
  )

}

export default function Delivery() {
  //////////////////////////////////////////////////////////
  // API FETCHING CODE //
  const theme = useTheme();
  const [deliveryOrder, setdeliveryOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);  

  const Navigation = useNavigation();
  const fetchData = async () => {   
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const url = user.role === 'admin' ? serverUrl.getAllDelivery : serverUrl.getDeliveryOrdersByGodownId+user.godownId;
      api.get(url)
      .then(response => {
        setdeliveryOrder(response.data);
      
      })
      // console.log(deliveryOrder)
      .catch(error => {
        // console.error('Error fetching data:', error);
      })
      .finally(() => setLoading(false));
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };
  

/////////////////////////////////////////////////
     
  return (
    <>
      {
        loading ? (
        <View style={{marginTop: Dimensions.get('window').height*0.2}}>
          <Spinner animating={loading} size={"large"} color={theme.colors.loader} /> 
        </View>
        ): (
           
          <FlatList
                contentContainerStyle={{ paddingBottom:Dimensions.get("window").height*0.5 ,}}
                ListEmptyComponent={NotFoundComponent}
                data={deliveryOrder}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.orderId}
                style={{ marginTop:Dimensions.get("window").height*0.005}} 
                renderItem={({ item }) => (
                
                    <Card style={[styles.card, {backgroundColor: theme.colors.cardBackground}]}  onPress={() => {
                      Navigation.navigate("Invoice", {
                        orderId: item.orderId,
                      });
                    }}>
                      <Card.Content style={{gap: 10}}>
                        <View style={[Grid.row, {alignItems: "center", gap: 10}]}>
                          <View style={Grid['4col']}>
                            <View style={[Grid.row, {marginBottom: Dimensions.get('window').height*0.01}]}>
                              <Text variant="bodySmall"  style={{color: "#64696E"}}>{item.orderDate.substring(0, 10).split("-").reverse().join("-")}</Text>
                            </View>
                            <View style={[Grid.row, {justifyContent: "space-between"}]}>
                              <Text variant="titleMedium" style={[{color: theme.colors.text1}]} >{`ORD${item.orderId}`} </Text>
                            </View> 
                          </View>
                          <View style={[Grid['1col'], {alignItems: "flex-end"}]}>
                            <MaterialIcons name="chevron-right" size={20} color="#64696E" />
                          </View>
                        </View>

                      </Card.Content>
                    </Card>
                )}
              />
        )
      }
    </>
  )
}
 
const styles = StyleSheet.create({
 
  card: {
    marginHorizontal: Dimensions.get("window").width * 0.05,
    marginTop: Dimensions.get("window").height * 0.015,
  },
  notFoundText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height*0.2
  }

});
