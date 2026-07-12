import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import api from "../../../api/axiosConfig"
import serverUrl from '../../../api/urls'

import { Card, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Grid } from "../../../components/GlobalStyle";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "../../../components/Spinner";

const imageSource = require("../../../../assets/purchase.png");

const NotFoundComponent = () => {
  return (
    <View style={styles.notFoundText}>
            <Text variant="bodyMedium">No Orders Found</Text>
      </View>
  )

}

export default function Purchase() {
  //////////////////////////////////////////////////////////
  // API FETCHING CODE //
  const [loading, setLoading] = useState(true);
  const [purchaseOrder, setpurchaseOrder] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    fetchData();
  }, []);

  const Navigation = useNavigation();
  const fetchData = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      api.get(serverUrl.getAllPurchase)
        .then(response => {
          const data = user.role === 'admin' ? response.data : response.data.filter((order) => {
            return order.godownId == user.godownId;
          });
          setpurchaseOrder(data);
        })
        .catch(error => {
          // console.error("Error fetching data:", error);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      // console.error("Error fetching user data:", error);
    }
  };
    

  return (
   <>
      {
       loading ? (
        <View style={{marginTop: Dimensions.get('window').height*0.2}}>
          <Spinner animating={loading} size={"large"} color={theme.colors.loader} /> 
        </View>
      ) : (
        
        <FlatList
            contentContainerStyle={{ paddingBottom:Dimensions.get("window").height*0.5 ,}}
            ListEmptyComponent={NotFoundComponent}
            data={purchaseOrder}
            keyExtractor={item => item.purchaseId}
            style={{ marginTop:Dimensions.get("window").height*0.005}}
            renderItem={({ item }) => (
                <Card style={[styles.card, {backgroundColor: theme.colors.cardBackground}]} onPress={() => {
                  Navigation.navigate("Purchase Details", {
                    purchaseId: item.purchaseId
                  });
                }}>
                  <Card.Content style={{gap: 10}}>
                    <View style={[Grid.row, {alignItems: "center", gap: 10}]}>
                      <View style={Grid['4col']}>
                        <View style={[Grid.row, {marginBottom: Dimensions.get('window').height*0.01}]}>
                          <Text variant="bodySmall"  style={{color: "#64696E"}}>{item.purchaseDate.substring(0, 10).split("-").reverse().join("-")}</Text>
                        </View>
                        <View style={[Grid.row, {justifyContent: "space-between"}]}>
                          <Text variant="titleMedium" style={[{color: theme.colors.text1}]}>{`PUR${item.purchaseId}`} </Text>
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

