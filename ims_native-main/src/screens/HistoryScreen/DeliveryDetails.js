import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import DeliveryAccordion from "./Components/DeliveryAccordion";
import { ScrollView } from "react-native-gesture-handler";
import Container from "../../components/Container";
import serverUrl from "../../api/urls";
import api from "../../api/axiosConfig";
const DeliveryDetails = ({ route }) => {
  const [data, setData] = useState(null);
  const { OrderId } = route.params;

  
  useEffect(() => {
    const getDeliveryData = async (id) => {
      try {
        const response = await api.get(`${serverUrl.getDeliveryDetails}/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // Call the function to fetch data when component mounts
    getDeliveryData(OrderId);
  }, [OrderId]);

  return (
    <ScrollView>
      <Container>
        <View style={styles.container}>
          <Text style={styles.heading}>Delivery Details</Text>
          <View style={styles.detailsContainer}>
            {data && (
              <>
                <Text style={styles.detailText}>
                  Delivery Id:{" "}
                  <Text style={styles.detailValue}>{data.orderId}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Date:{" "}
                  <Text style={styles.detailValue}>
                  {data.orderDate.substring(0, 10).split("-").reverse().join("-")}
                  </Text>
                </Text>
                <Text style={styles.detailText}>
                  Customer Name:{" "}
                  <Text style={styles.detailValue}>{data.customer.customerName}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Customer Address:{" "}
                  <Text style={styles.detailValue}>{data.customer.customerAddress}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Customer No:{" "}
                  <Text style={styles.detailValue}>{data.customer.customerNo}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Order Value:{" "}
                  <Text style={styles.detailValue}><Text> ₹</Text>{data.totalSellPrice}</Text>
                </Text>
                <DeliveryAccordion products={data.products} customer={data.customer}/>
              </>
            )}
          </View>
        </View>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#ffffff",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 18,
    color: "grey",
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: "bold",
  },
});

export default DeliveryDetails;
