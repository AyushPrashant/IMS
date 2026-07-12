import Container from "../../components/Container";
import { Dimensions, StyleSheet, View } from "react-native";
import { useContext, useState } from "react";
import CustomTextInput from "../../components/TextInput";
import CustomButton from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { Context as UserContext } from "../../context/UserContext";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { showMessage } from "react-native-flash-message";
import OTPVerification from "../../components/OtpVerification/OTPVerification";
import { color } from "react-native-elements/dist/helpers";
import { useTheme } from "react-native-paper";

const EditProfileScreen = () => {
    const [loading, setLoading] = useState(false)
    const [ isVerified, setIsVerified ] = useState(false);
    const navigation = useNavigation();
    const { state, updateUser } = useContext(UserContext)
    const theme = useTheme();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            godownHeadId: state.godownHeadId,
            name: state.godownHeadName,
            email: state.email,
            phoneNumber: state.godownheadNo,
            address: state.address,
        }
    });

    const onSubmit = (data) => {
        const trimmedData = {
            ...data,
            name: data.name.trim(),
            email: data.email.trim(),
            phoneNumber: data.phoneNumber.trim(),
            address: data.address.trim(),
        };

        setLoading(true);
        updateUser(trimmedData)
        .then((response) => {
            navigation.goBack();
            showMessage({
                message: "Success",
                description: response,
                type: "success",
            })
        })
        .catch((error) => {
            showMessage({
                message: "Failed",
                description: error,
                type: "danger",
            })
        })
        .finally (() => setLoading(false));
        
    }


    return (
        <KeyboardAwareScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}>
            <View style={styles.formContainer}>
            {
                    !isVerified ? ( 
                    <OTPVerification phoneNumber={state.godownheadNo} setIsVerified={(val) => setIsVerified(val)} /> 
                ) : (
                <Container>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label={"Name"}
                                placeholder={"Enter your name"}
                                value={value}
                                keyboardType={"default"}
                                secureTextEntry={false}
                                onChangeText={value => onChange(value)}
                                error={errors.name && errors.name.message}
                                icon={"account"}
                                position={"left"}
                            />
                        )}
                        name="name"
                        rules={{ 
                            required: 'Name is required',
                            pattern: {
                                value: /^(?=.*[A-Za-z])[A-Za-z\s]+$/,
                                message: 'Alphabets only'
                            }
                            
                        }}
                        
                    />

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label={"Email"}
                                placeholder={"Enter new email"}
                                value={value}
                                keyboardType={"email-address"}
                                secureTextEntry={false}
                                onChangeText={value => onChange(value)}
                                error={errors.email && errors.email.message}
                                icon={"email"}
                                position={"left"}
                            />
                        )}
                        name="email"
                        rules={{ 
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        }}
                        
                    />

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label={"Contact No."}
                                placeholder={"Enter your contact no."}
                                value={value}
                                keyboardType={"numeric"}
                                secureTextEntry={false}
                                onChangeText={value => onChange(value)}
                                error={errors.phoneNumber && errors.phoneNumber.message}
                                icon={"phone"}
                                position={"left"}
                            />
                        )}
                        name="phoneNumber"
                        rules={{ 
                            required: 'Phone Number is required',
                            pattern: {
                                value: /^\d[-\s()0-9]+$/,
                                message: 'Numbers only'
                            },
                            validate: value => value.replace(/[^\d]/g, '').length === 10 || 'Must be 10 digits'
                        }}
                        
                    />

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextInput
                                label={"Address"}
                                placeholder={"Enter your address"}
                                value={value}
                                keyboardType={"default"}
                                secureTextEntry={false}
                                onChangeText={value => onChange(value)}
                                error={errors.address && errors.address.message}
                                icon={"map-marker"}
                                position={"left"}
                            />
                        )}
                        name="address"
                        rules={{ required: 'Address is required' }}
                    />
                    <CustomButton title="Save" loading={loading} onSubmit={handleSubmit(onSubmit)} />
                </Container>
                
                )
                    
            }
                
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        // backgroundColor: "white",
    },

    formContainer: {
        width: Dimensions.get("window").width * 1,
        marginTop:10
    },

});

export default EditProfileScreen;
