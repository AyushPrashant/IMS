import React,{useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ProductType = ({ value }) => {
  const [onChange, setOnChange]=useState();

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Product Type" value="" />
        <Picker.Item label="2.2 kw" value="2.2" />
        <Picker.Item label="3.3 kw" value="3.3" />
        <Picker.Item label="4 kw" value="4" />
        <Picker.Item label="5 kw" value="5" />
        <Picker.Item label="6 kw" value="6" />
        <Picker.Item label="7 kw" value="7" />
        <Picker.Item label="8.8 kw" value="8.8" />
        <Picker.Item label="10 kw" value="10" />
        <Picker.Item label="12 kw" value="12" />
        <Picker.Item label="20 kw" value="20" />
        <Picker.Item label="50 kw" value="50" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default ProductType;
