import { StyleSheet} from 'react-native'
import React from 'react'

import Products from './Components/Products'


export default function ListProducts() {



  return (
    <>
    
   <Products  />
   
</>
  )
}
const styles = StyleSheet.create({

    inlineContainer: {
      flexDirection: 'row', // Align children components horizontally
      alignItems: 'center', // Align children components vertically
      justifyContent: 'space-between',
      
    },
    mainContainer:{
      flex:1,
    }

  });