import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Container from '../../components/Container';
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from '../../components/TextInput';
import CustomButton from '../../components/Button';
import { showMessage } from 'react-native-flash-message';
import instance from '../../api/axiosConfig';
import serverUrl from '../../api/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'react-native-paper';


const UpdateProduct = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const theme=useTheme()

    const { productData } = route.params;
    // console.log(productData);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            price: String(productData.price),
            volume: String(productData.productVolume),
            quantity: String(productData.totalQuantity)
        }
    });



    const onSubmit = async (data) => {
        setLoading(true);
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        try {
            const newData = {
                productName: productData.productName,
                godownId: user.godownId,
                price: data.price,
                productVolume: data.volume,
                totalQuantity: data.quantity
            };
            const response = await instance.patch(serverUrl.updateProduct, newData);

            // Alert.alert('Success', JSON.stringify(response.data));
            showMessage({
                message: "Success",
                description: "Product updated successfully",
                type: "success",
            });
            navigation.navigate('Product')
        } catch (error) {
            Alert.alert('Error', error.response.data);
        }

        // navigation.navigate('Product')
        setLoading(false);
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={[styles.container,{backgroundColor: theme.colors.background}]}>
            <View style={styles.formContainer}>
                <Container>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label={"Price"}
                                placeholder={"Enter product's cost price"}
                                value={value}
                                keyboardType="numeric"
                                icon={'currency-inr'}
                                onChangeText={onChange}
                                error={errors.price && errors.price.message}
                                position={"left"}
                            />
                        )}
                        name="price"
                        rules={{
                            required: 'price is required',
                            pattern: {
                                value: /^\d[-\s()0-9]+$/,
                                message: 'Numbers only'
                            },
                        }}
                    />

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label={"Volume"}
                                placeholder={"Enter product's volume"}
                                value={value}
                                keyboardType="numeric"
                                icon={'cube'}
                                onChangeText={onChange}
                                error={errors.volume && errors.volume.message}
                                position={"left"}
                            />
                        )}
                        name="volume"
                        rules={{ 
                            required: 'Volume is required',
                            pattern: {
                                value: /^\d[-\s()0-9]+$/,
                                message: 'Numbers only'
                            },
                         }}
                    />

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label={"Quantity"}
                                placeholder={"Enter product's quantity"}
                                value={value}
                                keyboardType="numeric"
                                icon={'package-variant'}
                                onChangeText={onChange}
                                error={errors.quantity && errors.quantity.message}
                                position={"left"}
                            />
                        )}
                        name="quantity"
                        rules={{ 
                            required: 'Quantity is required',
                            pattern: {
                                value: /^\d[-\s()0-9]+$/,
                                message: 'Numbers only'
                            },
                         }}
                    />

                    <CustomButton title="Update" loading={loading} onSubmit={handleSubmit(onSubmit)} />
                </Container>
            </View>
        </KeyboardAwareScrollView>
    );
};

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

export default UpdateProduct;
