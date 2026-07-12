import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity, Dimensions,
    ImageBackground,
    Keyboard,
} from "react-native";
import {
    Text, Snackbar, IconButton,
    useTheme,

} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../../context/authContext";
import instance from "../../api/axiosConfig";
import serverUrl from "../../api/urls";
import CustomTextInput from "../../components/TextInput";
import Container from "../../components/Container";
import CustomButton from "../../components/Button";
import { useForm, Controller } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Context as UserContext } from "../../context/UserContext";
import { Grid } from "../../components/GlobalStyle";




const LoginWithOTPScreen = () => {
    const theme = useTheme();
    const { state } = useContext(UserContext);
    const [countdown, setCountdown] = useState(0);
    const [resentLoader, setResentLoader] = useState(false)
    const [loading, setLoading] = useState(false)
    const { sendOtp, verifyOtp } = useContext(UserContext);
    const [phone, setPhone] = useState('');
    const { handleLogin, handleLoginWithOTP } = useContext(AuthContext);
    const navigation = useNavigation();
    const [name, setUsername] = useState("");
    const [otp, setOTP] = useState('');
    const [otpsent, setOtpsent] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState({
        phone: { message: "" },
        otp: { message: "" }
    });
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: name,
            password: password,
        }
    });
    const { loginWithOTP } = useContext(AuthContext)
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleVerifyOTP = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const phoneRegex = /^\d[-\s()0-9]+$/;
                const otpRegex = /^\d{6}$/;
                setError({ phone: { message: "" }, otp: { message: "" } });
                if (!phoneRegex.test(phone) || phone.length !== 10) {
                    // Display error message if phone number is invalid
                    setError({ phone: { message: "Phone number is required and must be of 10 digits." } });
                    return;
                }

                if (!otpRegex.test(otp) || otp.length !== 6) {
                    setError({ otp: { message: "OTP is required and must be of 6 digits." } });
                    return;
                }

                const response = await loginWithOTP(phone, otp);


                // Resolve the Promise with the response
                resolve(response);
            } catch (error) {
                const errorResponse = error.response.data;
                reject(errorResponse);
            }
        });
    };

    // Usage example





    const handleLoginWithOTPAfterSendOtp = async () => {
        try {

            const phoneRegex = /^\d[-\s()0-9]+$/;
            setError({ phone: { message: "" }, otp: { message: "" } });
            if (!phoneRegex.test(phone) || phone.length !== 10) {
                // Display error message if phone number is invalid
                setError({ phone: { message: "Phone number is required and must be of 10 digits." } });
                return;
            }

            const response = await instance.post(serverUrl.sendOtp, { "godownheadNo": phone });

            // Display success message
            // Alert.alert('Success', 'OTP has been sent to your phone number.');
            showMessage({
                message: "Success",
                description: "OTP has been sent to your phone number successfully",
                type: "success",
            });
            setSnackbarVisible(true);
            setSnackbarMessage(`OTP received on your no is ${response.data}`);

            // Navigate to the OTP verification screen or handle it as per your UI flow
            setOtpsent(true)
            setCountdown(30)
            // navigation.navigate('LoginWithOTP', { phone });
        } catch (error) {
            // console.error('Error sending OTP:', error);
            // Alert.alert('Error', 'Failed to send OTP. Please try again.');
            // console.log(error.response);
            showMessage({
                message: "Failed",
                description: error.response.data,
                type: "danger",
            });
        }
    };

    const onSubmit = () => {

        handleVerifyOTP()
            .then(response => {
                // OTP verification successful
                // Display success message
                showMessage({
                    message: "Success",
                    description: response,
                    type: "success",
                });

                navigation.navigate("IMS");
            })
            .catch(error => {
                // OTP verification failed
                // console.error("Error verifying OTP:", error);
                showMessage({
                    message: "Error",
                    description: error,
                    type: "danger",
                });

            });
    };

    useEffect(() => {
        // sendOtpHandler(phoneNumber);
        const timer = setInterval(() => {
            if (countdown > 0) {
                setCountdown((prevCountdown) => prevCountdown - 1);
            } else {
                clearInterval(timer);
            }
        }, 1000);


        return () => clearInterval(timer);

    }, [countdown]);

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    const formattedTime = `${seconds.toString().padStart(2, "0")}`;


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow",
            () => {
                setKeyboardOpen(true);
            });
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide",
            () => {
                setKeyboardOpen(false);
            });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        }
    }, []);

    const sendOtpHandler = (phone) => {
        setResentLoader(true);
        setLoading(false);

        sendOtp(phone)
            .then((response) => {
                showMessage({
                    message: "Success",
                    description: "OTP sent",
                    type: "success",
                })
                setSnackbarVisible(true);
                setSnackbarMessage(`OTP received on your no is ${response}`);
                setCountdown(30);

            })
            .catch((error) => {
                showMessage({
                    message: "Failed",
                    description: error,
                    type: "danger",
                })
            })
            .finally(() => setResentLoader(false));
    }



    return (
        <>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={30000}
                style={[styles.snackbarMessage, {backgroundColor: theme.colors.snackbar, opacity:1}]} 
            >
                <View style={[Grid.row, { alignItems: "center" }]}>
                    <View style={Grid["1col"]}>
                        <Text style={{ color: "white" }}> {snackbarMessage} </Text>
                    </View>
                    <View>
                        <IconButton
                            icon="close"
                            iconColor="white"
                            size={20}
                            onPress={() => setSnackbarVisible(false)}
                        />
                    </View>
                </View>

            </Snackbar>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                enableAutomaticScroll={false}

            >
                <View style={styles.mainContainer}>
                    <ImageBackground source={
                        state.isDarkThemeOn === 'dark'
                            ? require('../../../assets/background-dark.png')
                            : require('../../../assets/background.png')
                    }
                        resizeMode="cover"
                        style={styles.backgroundImg}></ImageBackground>
                    <View style={styles.formContainer}>
                        <Container >
                            {!keyboardOpen && (
                                <View style={styles.loginImgContainer}>
                                    <Image
                                        source={require('../../../assets/LogoPyramid.png')}
                                        style={styles.icon}
                                    />
                                </View>
                            )}


                            {/* <Text style={styles.welcomeText}>Welcome!</Text>
                    <Text style={styles.extraText}>to Inventory Management System</Text> */}

                            <Text style={styles.welcomeText}>Welcome to Pyramid Electronics!</Text>
                            <Text style={styles.extraText}>Inventory Management System</Text>



                            {/* Added spacing View */}
                            {/* <View style={styles.spacingView} />
            <View style={styles.inputView}>
                <PaperInput
                    // secureTextEntry
                    mode="outlined"
                    label="Username"
                    value={name}
                    onChangeText={(name) => {
                        setUsername(name)
                    }}
                    style={{ width: 290 }}
                />
            </View> */}


                            {/* <Controller
                            control={control}

                            render={({ field: { onBlur, onChange, value } }) => (

                                <CustomTextInput
                                    label={"Username"}
                                    value={value}
                                    onBlur={onBlur}
                                    placeholder={"Enter your username"}
                                    icon={"account"}
                                    position={"left"}
                                    error={errors.username && errors.username.message}

                                    onChangeText={onChange}
                                />
                            )}

                            name="username"
                            rules={{
                                required: 'Username is required',
                            }}
                        />


                        <Controller
                            control={control}

                            render={({ field: { onBlur, onChange, value } }) => (


                                <CustomTextInput
                                    label={"Password"}
                                    placeholder={"Enter your password"}
                                    value={value}
                                    onChangeText={onChange}
                                    icon={"lock"}
                                    position={"left"}
                                    error={errors.password && errors.password.message}
                                    secureTextEntry={true}
                                />
                            )}

                            name="password"
                            rules={{
                                required: 'Password is required',
                            }}
                        /> */}


                            <Controller
                                control={control}

                                render={({ field: { onChange, onBlur, value } }) => (
                                    <CustomTextInput
                                        label={"Phone Number"}
                                        error={error.phone && error.phone.message}
                                        icon={"phone"}
                                        position={"left"}
                                        placeholder={"Enter your Phone number"}
                                        onBlur={onBlur}
                                        onChangeText={(phone) => {
                                            setPhone(phone)
                                        }}
                                        value={phone}
                                        keyboardType="phone-pad"
                                    />
                                )}
                                name="phone"
                            // rules={{
                            //     required: 'Phone number is required',
                            //     pattern: {
                            //         value: /^\d[-\s()0-9]+$/,
                            //         message: 'Numbers only'
                            //     },
                            //     validate: value => value.replace(/[^\d]/g, '').length === 10 || 'Must be 10 digits'
                            // }}
                            />

                            <Controller
                                control={control}

                                render={({ field: { onChange, onBlur, value } }) => (
                                    <CustomTextInput
                                        label={"OTP"}
                                        value={otp}
                                        icon={"shield-key"}
                                        position={"left"}
                                        placeholder={"Enter 6 digit OTP"}
                                        keyboardType="numeric"
                                        error={error.otp && error.otp.message}
                                        onChangeText={(otp) => {
                                            setOTP(otp)
                                        }}
                                    />
                                )}
                                name="otp"
                            // rules={{
                            //     required: 'OTP is required',
                            //     pattern: {
                            //         value: /^\d{6}$/,
                            //         message: 'Numbers only'
                            //     }
                            // }}
                            />

                            {/* <CustomTextInput
                            label={"OTP"}
                            value={otp}
                            icon={"form-textbox-password"}
                            position={"left"}
                            placeholder={"Enter 6 digit OTP"}
                            keyboardType="numeric"
                            onChangeText={(otp) => {
                                setOTP(otp)
                            }}
                        /> */}


                            {
                                countdown > 0 ? (
                                    <Text variant="bodyMedium" style={styles.timer}>
                                        Resend OTP in <Text style={[styles.timer, { color: countdown < 15 ? "green" : "black", fontWeight: 'bold' }]}>{formattedTime}</Text>
                                    </Text>
                                ) : (
                                    <TouchableOpacity style={{ marginLeft: 150 }} onPress={handleLoginWithOTPAfterSendOtp}>
                                        <Text style={styles.forgot_button}>
                                            {!otpsent ? "Send OTP" : "Resend OTP"}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }

                            <CustomButton disabled={!otpsent} title={"LOGIN"} onSubmit={handleSubmit(onSubmit)} />

                            {/* </View> */}



                            <TouchableOpacity style={{}} onPress={() => navigation.navigate("LoginScreen")}>
                                <Text style={styles.loginOTP_button}>
                                    Login with Password
                                </Text>
                            </TouchableOpacity>

                        </Container>
                    </View>

                </View>
            </KeyboardAwareScrollView>
        </>

    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: "#fff",
    //     alignItems: "center",
    //     justifyContent: "center",


    // },

    scrollContainer: {
        // borderWidth: 5,
        flex: 1,
    },
    logo: {
        width: 210,
        height: 100,
        alignSelf: "center"
    },
    inputView: {
        backgroundColor: "#87ceeb",
        borderRadius: 5,
        // width: 4,
        height: 40,
        marginBottom: 20,
        alignItems: "center",
        flexDirection: "row",
    },
    forgot_button: {
        width: Dimensions.get("window").width > 600 ? "87%" : "100%",
        fontSize: Dimensions.get("window").width > 600 ? 20 : 14,
        alignItems: "flex-end",
        marginBottom: 25,
        textAlign: "right",
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
    loginText: {
        color: "white",
        fontRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0,
        backgroundColor: "#4169e1",
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
    },
    welcomeText: {

        // marginBottom: 10,
        // fontWeight: 'bold',
        fontSize: Dimensions.get('window').width > 600 ? 35 : 21,
        textAlign: "center",
        // marginTop:20

    },
    extraText: {
        marginBottom: Dimensions.get('window').width > 600 ? 35 : 10,
        // fontWeight: 'bold',
        fontSize: Dimensions.get('window').width > 600 ? 26 : 18,
        textAlign: "center"
    },
    titleText: {
        marginBottom: 20,
        fontWeight: "bold",
        fontFamily: "Cochin"
    },
    // spacingView: { // Added spacing view
    //     marginBottom: 20, // Adjust margin as needed
    // },
    mainContainer: {
        backgroundColor: '#fff',
        // flex: 1,

        width: Dimensions.get("window").width * 1,
        height: Dimensions.get("window").width * 1.6,
        // marginTop:10
        // paddingTop: StatusBar.currentHeight,
    },
    icon: {
        width: Dimensions.get('window').width > 600 ? 400 : 250,
        height: Dimensions.get('window').width > 600 ? 180 : 100,
        // marginTop:10
    },
    formContainer: {
        flex: 1,
        marginTop: Dimensions.get('window').width > 600 ? 0 : Dimensions.get('window').height * 0.12,
        marginBottom: Dimensions.get('window').width > 600 ? Dimensions.get('window').height * 0.1 : 0,

    },
    loginImgContainer: {

        resizeMode: 'cover',
        alignItems: 'center',
        marginBottom: Dimensions.get('window').width > 600 ? Dimensions.get('window').height * 0.02 : Dimensions.get('window').height * 0.04,
    },
    backgroundImg: {
        flex: 1,
        position: "absolute",
        width: Dimensions.get("window").width * 1,
        height: Dimensions.get("window").height * 1.1,
        justifyContent: 'center',
    },
    timer: {
        textAlign: "right",
        marginVertical: Dimensions.get("window").height * 0.02,
        color: 'grey',
        marginRight: Dimensions.get("window").width > 600 ? Dimensions.get("window").width * 0.09 : 0,
        fontSize: Dimensions.get("window").width > 600 ? Dimensions.get("window").width * 0.02 : 14,

    },
    snackbarMessage: {
        bottom: Dimensions.get("window").height * 0.9,
        zIndex: 1,
    },
    loginOTP_button: {
        width: "100%",
        // alignItems:"center",
        marginBottom: 25,
        textAlign: "center",
        fontSize: Dimensions.get('window').width > 600 ? 20 : 14,
    },

});

export default LoginWithOTPScreen;