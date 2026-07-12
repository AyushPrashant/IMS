import React, { useState } from 'react';
import { StyleSheet, View, Alert, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import Container from '../../components/Container';
import serverUrl from '../../api/urls';
import instance from '../../api/axiosConfig';
import CustomTextInput from '../../components/TextInput';
import { showMessage } from 'react-native-flash-message';
import CustomButton from '../../components/Button';
import { useTheme } from 'react-native-paper';

export default function AddSupplier({ navigation }) {
  const { handleSubmit, control, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const newData = {
        supplierName: data.name,
        contactNumber: data.contact,
        address: data.address,
      };
      const response = await instance.post(serverUrl.createSupplier, newData);
      // Alert.alert('Success', JSON.stringify(response.data));
      showMessage({
        message: "Success",
        description: "Supplier added successfully",
        type: "success",
    });
      navigation.navigate('Supplier')
    } catch (error) {
      // console.error('Error:',error.response.data);
      Alert.alert('Error', error.response.data);
    }
    
    setLoading(false);
  };


  return (

      <KeyboardAwareScrollView contentContainerStyle={[styles.container,{backgroundColor: theme.colors.background}]} >
        <View style={styles.formContainer}>
          <Container>
          <Controller 
            control={control}
            rules={{
              required: 'Name is required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Alphabets only'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Name"}
                placeholder={"Enter your name"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                icon={"account"}
                position={"left"}
                error={errors.name && errors.name.message}
              />
            )}
            name="name"
          />
          {/* {errors.name && <Text>This field is required.</Text>} */}

          <Controller
            control={control}
            rules={{
              required: 'Address is required'
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Address"}
                error={errors.address && errors.address.message}

                placeholder="Enter Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                icon={"map-marker"}
                position={"left"}
              />
            )}
            name="address"
          />
          {/* {errors.address && <Text>This field is required.</Text>} */}

          <Controller
            control={control}
            rules={{
              required: 'Contact is required',
              pattern: {
                value: /^\d[-\s()0-9]+$/,
                message: 'Numbers only'
              },
              validate: value => value.replace(/[^\d]/g, '').length === 10 || 'Must be 10 digits'
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label={"Contact No."}
                error={errors.contact && errors.contact.message}
                icon={"phone"}
                position={"left"}
                placeholder={"Enter your contact no."}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
              />
            )}
            name="contact"
          />
          {/* {errors.contact && <Text>This field is required.</Text>} */}
          {/* <View >
            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </View> */}
          <CustomButton title={"Submit"} onSubmit={handleSubmit(onSubmit)} />
          </Container>
        </View>
      </KeyboardAwareScrollView>


  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    
},
  formContainer: {
    // width: '80%',
    // justifyContent:'center',
    // borderWidth:1,
    width: Dimensions.get("window").width * 1,
    // backgroundColor:"white",
    // flexGrow:1,
    // alignSelf: 'center',
    // marginTop: Dimensions.get('window').height * 0.2
  },
});
