import { useContext, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';
import * as React from 'react';
import { FAB, Portal, useTheme } from 'react-native-paper';
import { Context as UserContext } from '../context/UserContext';

const FloatingActionButton = ({theme}) => {
  const navigation = useNavigation();
  const { role } = useContext(AuthContext);
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
const { state1 } = useContext(UserContext);

  const [actions, setActions] = useState([

    {
      icon: "truck-plus-outline" ,
      label: "Add Supplier",
      labelTextColor:theme.colors.text1,
      color: '#077FB6',
      onPress: () => navigation.navigate('Add Supplier'),
      style:{backgroundColor:'white'}
    }
  ]);


  useEffect(() => {
    if (role === 'admin') {
      setActions(prevActions => [
        ...prevActions,
        {
          icon: "account-plus-outline",
          labelTextColor:theme.colors.text1,

          label: "Add Customer",
          color: '#077FB6',
          onPress: () => navigation.navigate("Add Customer"),
          style:{backgroundColor:'white'}

        },
        {
          style:{backgroundColor:'white'},
          icon: "warehouse" ,
          labelTextColor:theme.colors.text1,

          label: "Add Godown",
          color: '#077FB6',
          onPress: () => navigation.navigate("Add Godown")



        }
      ]);
    } else {
      setActions(prevActions => [
        ...prevActions,
        {
          style:{backgroundColor:'white'},
          icon: "cart-plus",
          label: "Add Product",
          labelTextColor:theme.colors.text1,

          color: '#077FB6',
          onPress: () => navigation.navigate("Add Product")

        },
        {
          style:{backgroundColor:'white'},
          icon: "warehouse",
          label: "Purchase Order",
          labelTextColor:theme.colors.text1,

          color: '#077FB6',
          onPress: () => navigation.navigate("Purchase Order")

        }
      ]);
    }
  }, [role]);

  return (
      <Portal>
        <FAB.Group
        // style={{zIndex:1, }}
          open={open}
          color='white'
          visible
          fabStyle={{backgroundColor:'#077FB6', marginBottom:30,marginRight:Dimensions.get('window').width*0.05}}
          // rippleColor={'#FFF'}
          
          backdropColor={theme.colors.backdrop}
          icon={open ? 'close' : 'plus'}
          actions={actions}
          
          onStateChange={onStateChange}
          
        />
      </Portal>
  );
};


export default FloatingActionButton;
