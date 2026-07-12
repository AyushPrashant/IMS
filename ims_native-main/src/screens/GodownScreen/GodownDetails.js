import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text,useTheme } from "react-native-paper";
import GodownAccordion from "./Components/GodownAccordion";
import { ScrollView } from "react-native-gesture-handler";
import Container from "../../components/Container";
import serverUrl from "../../api/urls";
import api from "../../api/axiosConfig";

const GodownDetails = ({ route }) => {
  // console.log(route.params);
  const [Data, setData] = useState(null);
  const { godownId } = route.params;
  const [name, setName] = useState("");
  const theme=useTheme()

  // console.log(godownId);


  useEffect(() => {
    const getGodownData = async (id) => {
      try {
        const response = await api.get(`${serverUrl.getGodownDetails}/${id}`);
        setData(response.data);
        // console.log("api response:", response.data); // Log fetched data
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    const getGHname = async () => {
      try {
        const response = await api.get(`${serverUrl.getGodownHeadByGodownId}/${godownId}`);
        setName(response.data.godownHeadName);
      } catch (error) {
        // console.error("Error fetching revenue data:", error);
      }
    };

    // Call the function to fetch data when component mounts or when godownId changes
    getGodownData(godownId);
    getGHname();
  }, [godownId]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView>
        <Container>
          <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <View style={styles.detailsContainer}>
              {Data && (
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.detailText}>
                      Godown Id:{" "}
                      <Text style={styles.detailValue}>{Data.godownId}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                      GodownHead Name:{" "}
                      <Text style={styles.detailValue}>{name}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                      Godown Address:{" "}
                      <Text style={styles.detailValue}>{Data.address}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                      Godown Volume:{" "}
                      <Text style={styles.detailValue}>{Data.volume}</Text>
                    </Text>
                  </View>
                  <GodownAccordion products={Data.productList} />
                </>
              )}
            </View>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 15,
    color: "grey",
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: "bold",
  },
});

export default GodownDetails;
