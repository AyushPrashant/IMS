import React from "react";
import { StyleSheet } from "react-native";
import { List, Avatar, Divider, Text } from "react-native-paper";

const DeliveryAccordion = ({ products, customer }) => {
  // Check if products or customer data is null or undefined
  if (!products || !customer || customer.length === 0) {
    return null; // If any of these are null or undefined, render nothing
  }

  return (
    <>
      {products.map((product, index) => (
        <List.Section key={index}>
          <List.Accordion
            title={product.productName}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
            left={(props) => (
              <List.Icon {...props} icon="package-variant" color="black" />
            )}
          >
            <List.Item
              title="Product Quantity: "
              left={() => (
                <Avatar.Icon
                  size={24}
                  icon="cube-outline"
                  color="black"
                  backgroundColor="transparent"
                />
              )}
              right={() => <Text>{product.orderQuantity}</Text>}
            />
            <Divider />
            <List.Item
              title="Sell Price: "
              left={() => (
                <Avatar.Icon
                  size={24}
                  icon="ev-station"
                  color="black"
                  backgroundColor="transparent"
                />
              )}
              right={() => <Text>{product.sellPrice}</Text>}
            />
          </List.Accordion>
        </List.Section>
      ))}
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
    fontSize: 18,
  },
});

export default DeliveryAccordion;
