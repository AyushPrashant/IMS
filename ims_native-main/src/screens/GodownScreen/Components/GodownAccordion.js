import React from "react";
import { StyleSheet } from "react-native";
import { List, Avatar, Divider, Text,useTheme } from "react-native-paper";

const GodownAccordion = ({products}) => {
  const theme=useTheme()
    console.log("api response" + products);
  // Check if productList is null or undefined
  if (!products) {
    return null; // If productList is null or undefined, render nothing
  }

  return (
    <>
      {products.map((product, index) => (
        <List.Section key={index}>
          <List.Accordion
            title={product.productName}
            style={[styles.accordion,{backgroundColor: theme.colors.cardBackground}]}
            titleStyle={[styles.accordionTitle,{color: theme.colors.text1}]}
            left={(props) => (
              <Avatar.Icon
                  size={35}
                  // {...props}
                  icon="package-variant"
                  color={theme.colors.text1}
                  backgroundColor="transparent"
                  
                />
            )}
          >
            <List.Item
              title="Product Volume: "
              left={() => (
                <Avatar.Icon
                  size={24}
                  icon="cube-outline"
                  color={theme.colors.text1}
                  backgroundColor="transparent"
                />
              )}
              right={() => <Text>{product.productVolume}</Text>}
            />
            <Divider />
            <List.Item
              title="Price: "
              left={() => (
                <Avatar.Icon
                  size={24}
                  icon="cash"
                  color={theme.colors.text1}
                  backgroundColor="transparent"
                />
              )}
              right={() => <Text>{product.price}</Text>}
            />
            <Divider />
            <List.Item
              title="Total Quantity: "
              left={() => (
                <Avatar.Icon
                  size={24}
                  icon="cart-outline"
                  color={theme.colors.text1}
                  backgroundColor="transparent"
                />
              )}
              right={() => <Text>{product.totalQuantity}</Text>}
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
    fontSize: 15,
  },
});

export default GodownAccordion;
