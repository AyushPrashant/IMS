import React, { useState, useContext } from "react";
import { StyleSheet, View, Alert, ImageBackground, StatusBar, Dimensions} from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from "../../components/TextInput";
import Container from "../../components/Container";
import CustomButton from "../../components/Button";
import instance from "../../api/axiosConfig";
import serverUrl from "../../api/urls";
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Context as UserContext } from "../../context/UserContext";



const ResetPasswordScreen = ({ route }) => {
    const {state} = useContext(UserContext);
    // const [phone, setPhone] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const { phone } = route.params;
    const [isVerified, setIsVerified] = useState(false);

    const handleResetPassword = async () => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            Alert.alert(
                'Error',
                'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number.'
            );
            return;
        }
        try {
            if (newPassword !== confirmPassword) {
                // Alert.alert('Error', 'Passwords do not match.');
                showMessage({
                    message: "Failed",
                    description: 'Passwords do not match.',
                    type: "danger",
                });
                return;
            }

            const response = await instance.patch(serverUrl.resetPassword, {
                "godownheadNo": phone,
                "newPassword": newPassword
            });
            // console.log(response.data);

            // Display success message
            // Alert.alert('Success', 'Password reset successfully.');
            showMessage({
                message: "Success",
                description: "Password reset successfully",
                type: "success",
            });

            // Navigate to the login screen or handle it as per your UI flow
            navigation.navigate('LoginScreen');
        } catch (error) {
            // console.error('Error resetting password:', error);
            Alert.alert('Error', 'Failed to reset password. Please try again.');
            showMessage({
                message: "Failed",
                description: 'Failed to reset password. Please try again.',
                type: "danger",
            });
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
            <View style={styles.mainContainer}>
                <ImageBackground source={
                    state.isDarkThemeOn === 'dark'
                        ? require('../../../assets/background-dark.png')
                        : require('../../../assets/background.png')
                }
                    resizeMode="cover"
                    style={styles.backgroundImg}></ImageBackground>
                <View style={styles.formContainer}>
                    <Container>

                        {/* {
                        !isVerified ? (<OTPVerification phoneNumber={phone} setIsVerified={(val) => setIsVerified(val)} />) : ( */}
                        <View>

                            <Text style={styles.welcomeText}>Reset Password</Text>
                            <Text style={styles.extraText}>Set the new password for your account</Text>



                            <CustomTextInput
                                label={"New Password"}
                                value={newPassword}
                                placeholder={"Enter new Password"}
                                keyboardType="default"
                                icon={"lock"}
                                position={"left"}
                                onChangeText={(newPassword) => {
                                    setnewPassword(newPassword)
                                }} />






                            <CustomTextInput
                                label={"Confirm Password"}
                                value={confirmPassword}
                                placeholder={"Confirm Password"}
                                keyboardType="default"
                                secureTextEntry={true}
                                icon={"lock"}
                                position={"left"}
                                onChangeText={(confirmPassword) => {
                                    setConfirmPassword(confirmPassword)
                                }} />

                            <CustomButton title={"RESET PASSWORD"} onSubmit={handleResetPassword} />
                        </View>





                    </Container>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    logoContainer: {
        marginBottom: 40,
        alignItems: "center",
    },
    logo: {
        width: 210,
        height: 100,
    },
    inputView: {
        backgroundColor: "#87ceeb",
        borderRadius: 5,
        height: 40,
        marginBottom: 20,
        alignItems: "center",
        flexDirection: "row",
    },
    loginBtn: {
        width: "80%",
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0,
        backgroundColor: "#4169e1",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    welcomeText: {
        marginTop: 90,
        marginBottom: 10,
        fontSize: Dimensions.get('window').width > 600 ? 35 : 25,
        textAlign: "center"
    },
    extraText: {
        marginBottom: 10,
        // fontWeight: 'bold',
        fontSize: Dimensions.get('window').width > 600 ? 25 : 18,
        textAlign: "center"
    },
    mainContainer: {
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    icon: {
        width: 250,
        height: 100,
        alignSelf: "center"
    },
    formContainer: {
        flex: 1,

        margin: 5
    },
    loginImgContainer: {

        alignItems: 'center',
        marginBottom: Dimensions.get('window').height * 0.08,
    },
    backgroundImg: {
        flex: 1,
        position: "absolute",
        width: Dimensions.get("window").width * 1,
        height: Dimensions.get("window").height * 1,
        // borderWidth: 1,
        justifyContent: 'center',
    }
});

export default ResetPasswordScreen;