import React, { useContext } from 'react';
import { Context as UserContext } from '../context/UserContext';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';
import Constants from 'expo-constants';



const TopBar = ({ route }) => {

  const theme = useTheme();
  const title = route.name;

  const navigation = useNavigation();
  const { role } = useContext(AuthContext);


  const handleSupplierPress = () => {
    // Navigate to the "Add Supplier" page
    navigation.navigate('Supplier');
    // Close the menu
    closeMenu();
  };

  const handleProductPress = () => {
    // Navigate to the "Add Supplier" page
    navigation.navigate('Product');
    // Close the menu
    closeMenu();
  };

  const handleGodownPress = () => {
    // Navigate to the "Add Supplier" page
    navigation.navigate('Godown');
    // Close the menu
    closeMenu();
  };

  const handleCustomerPress = () => {
    // Navigate to the "Add Supplier" page
    navigation.navigate('Customer');
    // Close the menu
    closeMenu();
  };
  // console.log(title);
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { state } = useContext(UserContext);
  return (
    <Appbar.Header
      // statusBarHeight={Platform.OS === "ios" ? 0 : StatusBar.currentHeight}
      style={{ backgroundColor: state.isDarkThemeOn === 'dark' ? theme.colors.cardBackground : theme.colors.secondaryContainer, borderBottomWidth: state.isDarkThemeOn === 'dark' ? 0.4 : 0, borderBottomColor: theme.colors.lineseparator }}
      elevated={true}
    >
      <Appbar.Content title={title}
        color='#FFFFFF'
      />


      <Menu

        style={{ borderRadius: 10 }}
        contentStyle={{ backgroundColor: theme.colors.cardBackground }}
        visible={visible}
        onDismiss={closeMenu}
        anchor={

          <Appbar.Action

            icon="menu"
            color='#FFFFFF'
            onPress={openMenu}

          />
        }>
        <Menu.Item
          onPress={handleSupplierPress}
          title="Supplier"

        />

        <Menu.Item
          onPress={handleProductPress}
          title="Product"

        />

        {role === 'admin' && (
          <React.Fragment>
            <Menu.Item
              onPress={handleGodownPress}
              title="Godown"

            />
            <Menu.Item
              onPress={handleCustomerPress}
              title="Customer"

            />
          </React.Fragment>
        )}




      </Menu>
    </Appbar.Header>
  );
}

export default TopBar;