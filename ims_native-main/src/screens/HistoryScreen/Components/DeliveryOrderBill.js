import { View, Text, ScrollView, StyleSheet,Dimensions,Linking,TouchableOpacity } from 'react-native'
import React, {useEffect,useState} from 'react'
import { Feather } from '@expo/vector-icons';
import api from "../../../api/axiosConfig"
import serverUrl from '../../../api/urls'
import {useTheme } from "react-native-paper";


export default function DeliveryOrderBill({ route }) {
  const { orderId } = route.params;
  const theme=useTheme()
  const [item,setItem] = useState("");
  // API FETCHING CODE //

  const [deliveryOrder, setdeliveryOrder] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);  

  const fetchData = async () => {
   
    try {
      const response = await api.get(serverUrl.getDeliveryOrdersById+orderId);
      
      setdeliveryOrder(response.data);
      
      // if()
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const downloadInvoice = () => {
    const invoiceUrl = serverUrl.invoiceApi+orderId;
    Linking.openURL(invoiceUrl);
};

  ///////////////////////////////////
  // const renderProductItem = ({ item,index }) => {
  //   return (
  //     <View style={styles.productContainer}>
  //       <Text style={styles.productName}>{item.productName}</Text>
  //       <View style={styles.orderitempriceconatiner}>
  //       <Text style={styles.productQty}>₹{item.sellPrice} x {item.orderQuantity} </Text>
  //       <Text style={styles.productPrice}>₹{item.sellPrice*item.orderQuantity}</Text>
  //       </View>
  //     </View>
  //   );
  // };

  const renderProductItems = (products) => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return null; 
    }
  
    return products.map((item, index) => (
      <View style={styles.productContainer} key={index}>
        <Text style={[styles.productName,{color: theme.colors.text1}]}>{item.productName}</Text>
        <View style={styles.orderitempriceconatiner}>
          <Text style={[styles.productQty,{color: theme.colors.text3}]}>₹{item.sellPrice} x {item.orderQuantity}</Text>
          <Text style={[styles.productPrice,{color: theme.colors.text3}]}>₹{item.sellPrice * item.orderQuantity}</Text>
        </View>
      </View>
    ));
  };

    return (
      
 <ScrollView style={[styles.mainContainer, {backgroundColor: theme.colors.background}]} showsVerticalScrollIndicator={false}>
   
 
    <View style={styles.View1}>
        <Text style={[styles.orderTitle,{color: theme.colors.text1}]}>Order Summary</Text>
        <TouchableOpacity onPress={downloadInvoice}>
        <Text style={[styles.downloadTxt, {color: theme.colors.supplierId} ]}>Download Invoice <Feather name="download" size={14} /></Text>
        </TouchableOpacity>
        {deliveryOrder.products?.length > 0 && (
        <Text style={[styles.title2,{color: theme.colors.text1}]}>{deliveryOrder.products.length} {deliveryOrder.products.length > 1 ? "items" : "item"} in this order</Text>
        )}
    </View>
   <View>
        {/* <FlatList
        data={deliveryOrder.products}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => index.toString()}


        /> */}
        { renderProductItems(deliveryOrder.products)}
    </View>
   
    
    <View style={[styles.paymentInfoContainer,{borderColor: theme.colors.text4}]}>
        <Text style={[styles.title3,{color: theme.colors.text1}]}>Payment Details</Text>
        <View style={styles.orderitempriceconatiner}>
          <Text style={[styles.nameText,{color: theme.colors.text1}]}>Sub Total</Text>
          <Text style={[styles.nameText,{color: theme.colors.text3}]}>₹{(deliveryOrder.totalSellPrice || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.orderitempriceconatiner}>
          <Text style={[styles.nameText,{color: theme.colors.text1}]}>CGST 9%</Text>
          <Text style={[styles.nameText,{color: theme.colors.text3}]}>₹{(deliveryOrder.totalSellPrice ? (deliveryOrder.totalSellPrice * 0.09).toFixed(2) : 0)}</Text>
        </View>
        <View style={styles.orderitempriceconatiner}>
        <Text style={[styles.nameText,{color: theme.colors.text1}]}>SGST 9%</Text>
          <Text style={[styles.nameText,{color: theme.colors.text3}]}>₹{(deliveryOrder.totalSellPrice ? (deliveryOrder.totalSellPrice * 0.09).toFixed(2) : 0)}</Text>
        </View>
        <View style={styles.orderitempriceconatiner}>
        <Text style={[styles.productPrice,{color: theme.colors.text1}]}>Total Amount</Text>
          <Text style={[styles.productPrice,{color: theme.colors.text1}]}>₹{((deliveryOrder.totalSellPrice || 0) + ((deliveryOrder.totalSellPrice || 0) * 0.18)).toFixed(2)}</Text>
        </View>
    </View>

    <View style={{flex:1}}>
      <Text style={[styles.title3,{color: theme.colors.text1}]}>Order Details</Text>
      <Text style={[styles.detailFeild,{color: theme.colors.text1}]}>Order Id</Text>
      <Text style={[styles.detailValue,{color: theme.colors.text3}]}>ORD{deliveryOrder.orderId}</Text>
      <Text style={[styles.detailFeild,{color: theme.colors.text1}]}>Deliver to</Text>
      {deliveryOrder.customer && (
      <Text style={[styles.detailValue,{color: theme.colors.text3}]}>{deliveryOrder.customer.customerName}, {deliveryOrder.customer.customerAddress}</Text>
      )}
      <Text style={[styles.detailFeild,{color: theme.colors.text1}]}>Order date</Text>
      <Text style={[styles.detailValue,{color: theme.colors.text3}]}>{deliveryOrder.orderDate ? deliveryOrder.orderDate.substring(0, 10).split("-").reverse().join("/") : ""}</Text>
      <Text style={[styles.detailFeild,{color: theme.colors.text1}]}>Sold By</Text>
      <Text style={[styles.detailValue,{color: theme.colors.text3}]}>{deliveryOrder.godownHeadName}, {deliveryOrder.godownAddress}</Text>
      
    </View>
  
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  mainContainer:{
    padding:'3%',
    backgroundColor:'#FFF',
  
    flex:1

  },
    orderTitle:{
        fontSize:22,
        fontWeight:'bold',

       },
      title2:{
        fontSize:18,
        fontWeight:'bold',
      },
      View1:{
       
        marginBottom:'5%'
      },
      downloadTxt:{
        marginTop:'1.5%',
        marginBottom:'2%'
      },

      productName:{
        fontWeight:'500',
        fontSize:16,
        marginBottom:'0.5%'
      },
      productQty:{
        fontWeight:'400',
        color:'rgb(130,135,138)'
      },
      productContainer:{
        marginBottom:'2%',
     
      },
      productPrice:{
        fontWeight:'bold',
        fontSize:14.5,
      },

    orderitem:{

    },
    title3:{
      fontSize:18,
      fontWeight:'bold',
      marginBottom:'5%',
      marginTop:'3%'
    },
    orderitempriceconatiner:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',
        marginVertical: '1.5%',
    },
    paymentInfoContainer:{
      borderTopWidth:Dimensions.get('window').height*0.015,
      // borderColor:'#F5F6FC',
      borderBottomWidth:Dimensions.get('window').height*0.015,
    },
    detailFeild:{
      color:'rgb(118,120,128)',
      marginVertical: '0.5%',
    },
    detailValue:{
      marginVertical: '0.5%',
      marginBottom:'2.5%',
     
    },

})