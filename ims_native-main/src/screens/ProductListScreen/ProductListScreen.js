
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import ListProducts from './ListProducts'


const Stack = createStackNavigator();
export default function ProductListScreen() {
  return (

<ListProducts/>

  )
}
