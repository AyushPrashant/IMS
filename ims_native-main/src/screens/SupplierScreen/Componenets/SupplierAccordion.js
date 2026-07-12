import React from "react";
import { StyleSheet } from "react-native";
import { List, Avatar, Divider, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SupplierAccordion = ({ supplier }) => {
  console.log("api response" + supplier);
  // Check if productList is null or undefined
  if (!supplier) {
    return null; // If productList is null or undefined, render nothing
  }

  return (
    <>
      <List.Accordion
        title={supplier.supplierName}
        style={styles.accordion}
        titleStyle={styles.accordionTitle}
        left={(props) => (
          <Avatar.Icon
            size={35}
            // {...props}
            icon="package-variant"
            color="black"
            backgroundColor="transparent"
          />
        )}
      >
        <List.Item
          title="Name: "
          left={() => (
            <MaterialCommunityIcons
              name="account-details"
              size={20}
              color="black"
            />
          )}
          right={() => <Text>{supplier.supplierName}</Text>}
        />
        <Divider />
        <List.Item
          title="Address: "
          left={() => <Entypo name="location-pin" size={20} color="black" />}
          right={() => <Text>{supplier.address}</Text>}
        />
        <Divider />
        <List.Item
          title="Contact No: "
          left={() => <MaterialIcons name="call" size={20} color="black" />}
          right={() => <Text>{supplier.contactNumber}</Text>}
        />
      </List.Accordion>
    </>
  );
};

const styles = StyleSheet.create({
  accordion: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 3,
  },
  accordionTitle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default SupplierAccordion;
