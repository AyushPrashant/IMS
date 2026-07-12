
import { StyleSheet, View, Dimensions, useWindowDimensions } from 'react-native';
import { SegmentedButtons, useTheme } from 'react-native-paper';
import Delivery from './Components/Delivery';
import Purchase from './Components/Purchase';
import Layout from '../../components/Layout';
import { Grid } from '../../components/GlobalStyle';
import CardComponent from '../../components/CardComponent';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../api/axiosConfig"
import serverUrl from "../../api/urls"
import { useIsFocused } from '@react-navigation/native';
import Spinner from '../../components/Spinner';

export default function HistoryScreen({ route }) {
  const {height} = useWindowDimensions();
  const theme = useTheme();
  const [value, setValue] = useState('Purchase');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    purchaseProductsCount: 0,
    soldProductsCount: 0,
  })

  const updateState = (newData) => {
    setData((prevState) => ({ ...prevState, ...newData }));
  };

  const fetchData = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const purchaseUrl = user.role === 'admin' ? serverUrl.getPurchaseProductsCount : serverUrl.getPurchaseProductCountBygodownId + user.godownId;
      api.get(purchaseUrl)
        .then(response => {
          // console.log("height: "+ Dimensions.get("window").height)
          updateState({ purchaseProductsCount: response.data })
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });


      const deliveryUrl = user.role === 'admin' ? serverUrl.getTotalDeliveryProducts : `${serverUrl.getSales}/${user.godownId}`;
      api.get(deliveryUrl)
        .then(response => {
          updateState({ soldProductsCount: user.role === 'admin' ? response.data : response.data.totalQuantitiesSold })
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => setLoading(false));


    } catch (error) {
      // console.error('Error fetching data:', error);
    }


  }

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchData()

  }, [isFocused])

  return (
    <>
      <Layout route={route}>
        {
          loading ? <Spinner animating={loading} size={"large"} color={theme.colors.loader} /> : (
            <View style={[styles.container]}>
              <View style={[Grid.row, styles.header]}>
                <CardComponent title={`${data.purchaseProductsCount}`} description="Products Purchased" iconName="inbox-arrow-down-outline"  iconLibrary={"MaterialCommunityIcons"} theme={theme} />
                <CardComponent title={`${data.soldProductsCount}`} description="Products Sold" iconName="inbox-arrow-up-outline" iconLibrary={"MaterialCommunityIcons"} theme={theme}  />
              </View>
              <View style={styles.segmentContainer}>
                <SegmentedButtons
                  value={value}
                  theme={theme}
                  onValueChange={setValue}
                  buttons={[
                    {
                      value: 'Purchase',
                      label: 'Purchase',
                      checkedColor:'white',
                      uncheckedColor: theme.colors.text3
                    },
                    {
                      value: 'Delivery',
                      label: 'Delivery',
                      checkedColor:'white',
                      uncheckedColor: theme.colors.text3
                    },

                  ]}
                />
              </View>
              {/* <View style={{borderWidth:1, borderColor:"yellow",}}> */}
                {value === "Purchase" ? <Purchase /> : <Delivery />}
              {/* </View> */}

            </View>
          )
        }


      </Layout>
    </>


  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: Dimensions.get("window").height * 0.01,
    // backgroundColor: "#fff"
  },
  segmentContainer: {

    alignItems: 'center',
    marginHorizontal: Dimensions.get("window").width * 0.05,
    marginVertical: Dimensions.get("window").height * 0.01,
  },

  header: {
    marginHorizontal: Dimensions.get("window").width * 0.05,
    marginVertical: Dimensions.get("window").height * 0.01,
    gap: Dimensions.get("window").width * 0.04,

  }
});
