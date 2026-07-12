import React, { useState } from 'react';
import { StyleSheet,View, Alert, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller  } from 'react-hook-form';
import Container from '../../components/Container';
import serverUrl from '../../api/urls';
import instance from '../../api/axiosConfig';
import CustomTextInput from '../../components/TextInput';
import CustomButton from '../../components/Button';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from 'react-native-paper';


export default function AddGodownHead({ navigation, route }) {
  const { godownId } = route.params;
  const theme = useTheme();
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      id: godownId,
      name: '',
      username: '',
      password: '',
      email: '',
      address: '',
      contact: '',
    }
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    // console.log("hhhhhhh")
    setLoading(true);
    try {
      const newData = {
        godownId: data.id,
        godownHeadName: data.name,
        username: data.username,
        password: data.password,
        email: data.email,
        address: data.address,
        godownHeadNo: data.contact,
      };
      console.log(newData);
      const response = await instance.post(serverUrl.createGodownhead, newData);
      showMessage({
        message: "Success",
        description: "GodownHead added successfully",
        type: "success",
    });
      // Alert.alert('Success', JSON.stringify(response.data));
      // Navigate to another screen after adding GodownHead
      navigation.navigate('Godown')
    } catch (error) {
      // console.log('Error:', error.response.data);
      Alert.alert('Error', error.response.data);
    }
    setLoading(false);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={[styles.container, {backgroundColor:theme.colors.background}]} >
        <View style={styles.formContainer}>
          <Container>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  label={"Godown Id"}
                  placeholder={"Enter Godown Id"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  disabled={true}
                  value={value}
                  icon={"account"}
                  position={"left"}
                  style={{borderColor:"white", borderWidth: 2}}
                  error={errors.id && errors.id.message}
                  keyboardType="phone-pad"

                />
              )}
              name="id"
              rules={{
                required: 'id is required',
                pattern: {
                  value: /^\d+$/, 
                  message: 'Godown Id must contain only numbers'
                }
                // pattern: {
                //   value: /^\d[-\s()]+$/,
                //   message: 'Numbers only'
                // }
              }}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  label={"Name"}
                  placeholder={"Enter Godownhead's name"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  icon={"account"}
                  position={"left"}
                  error={errors.name && errors.name.message}
                />
              )}
              name="name"
              rules={{
                required: 'Name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'Alphabets only'
                }
              }}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  label={"Username"}
                  placeholder={"Enter Godownhead's Username"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  icon={"account"}
                  position={"left"}
                  error={errors.username && errors.username.message}
                />
              )}
              name="username"
              rules={{
                required: 'username is required',
                pattern: {
                  value: /^[A-Za-z0-9\s]+$/,
                  message: 'Special character are not allowed'
                }
              }}
            />
            <Controller
              control={control}
              rules={{
                required: 'email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address',
                }
                
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  label={"Email"}
                  placeholder={"Enter Godownhead's email"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  icon={"email"}
                  position={"left"}
                  error={errors.email && errors.email.message}
                />
              )}
              name="email"
            />

            <Controller
              control={control}
              rules={{
                required: 'Address is required'
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  label={"Address"}
                  error={errors.address && errors.address.message}

                  placeholder="Enter Godownhead's Address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  icon={"map-marker"}
                  position={"left"}
                />
              )}
              name="address"
            />

            <Controller
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters long'
                        },
                        pattern: {
                            value: /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z])(?=.*[0-9].*[0-9]).{8,}$/,
                            message: 'Password must contain at least 1 special character, 1 alphabet, and 2 numeric'
                        }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  label={"Password"}
                  error={errors.password && errors.password.message}

                  placeholder="Enter Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  icon={"lock"}
                  position={"left"}
                  secureTextEntry

                />
              )}
              name="password"
            />

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
            
            {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />} */}
          
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
    backgroundColor: "white",
  },
  formContainer: {
    width: Dimensions.get("window").width * 1,
  },
});
