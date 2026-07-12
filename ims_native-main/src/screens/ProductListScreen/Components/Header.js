import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

export default function Header({Title}) {
  return (
    <View>
      <Text style={styles.headerTxt}>{Title}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
headerTxt:{
fontSize:22,
fontWeight: '400',
textAlign:'center',
marginTop:10,
}
})