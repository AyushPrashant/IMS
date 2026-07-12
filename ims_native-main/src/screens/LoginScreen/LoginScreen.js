import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity, Dimensions,
    ImageBackground,
    Keyboard,
    useColorScheme
} from "react-native";
import {useTheme , Text} from "react-native-paper";
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


const LoginScreen = () => {
    const {state} = useContext(UserContext);
    const theme = useTheme();
    const { handleLogin } = useContext(AuthContext);
    const navigation = useNavigation();
    const [name, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: name,
            password: password,
        }
    });


    const onSubmit = async (data) => {

        try {
            // console.log("in login")

            const raw = {
                "username": data.Username,
                "password": data.Password
            }

            const response = await instance.post(serverUrl.login, raw);
            const authData = {
                token: response.data.cookie,
                username: response.data.username
            }

            const user = {
                username: response.data.username,
                godownHeadId: response.data.godownHeadId,
                godownId: response.data.godownId,
                role: response.data.role,
            }
            showMessage({
                message: "Success",
                description: "Logged in successfully",
                type: "success",
            });

            handleLogin(authData, user);
        } catch (error) {
            setError('Failed to login. Please try again.');
            showMessage({
                message: "Login Failed",
                description: error.response.data.message,
                type: "danger",
            });
        }
    };
    useEffect(() => {
        // AsyncStorage.clear()
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

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableAutomaticScroll={false}
        >
            <View style={styles.mainContainer}>
   
                <ImageBackground
                source={
                    state.isDarkThemeOn === 'dark'                                           
                                             ? require('../../../assets/background-dark.png')
                                             : require('../../../assets/background.png')
                                         }
                    resizeMode="cover"
                    style={[styles.backgroundImg,{backgroundColor:theme.colors.loginText1}]}></ImageBackground>
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

                        <Text style={[styles.welcomeText,]}>Welcome to Pyramid Electronics!</Text>
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


                        <Controller
                            control={control}

                            render={({ field: { onBlur, onChange, value } }) => (

                                <CustomTextInput
                                label={"Username"}
                                    value={value}
                                    onBlur={onBlur}
                                    placeholder={"Enter your Username"}
                                    icon={"account"}
                                    position={"left"}
                                    error={errors.Username && errors.Username.message}

                                    onChangeText={onChange}
                                />
                            )}

                            name="Username"
                            rules={{
                                required: 'Username is required',
                            }}
                        />


                        <Controller
                            control={control}

                            render={({ field: { onBlur, onChange, value } }) => (


                                <CustomTextInput
                                label={"Password"}
                                    placeholder={"Enter your Password"}
                                    value={value}
                                    onChangeText={onChange}
                                    icon={"lock"}
                                    position={"left"}
                                    error={errors.Password && errors.Password.message}
                                    secureTextEntry={true}
                                />
                            )}

                            name="Password"
                            rules={{
                                required: 'Password is required',
                            }}
                        />

                        {/* <View style={styles.inputView}>
                <PaperInput
                    mode="outlined"
                    label="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    style={{ width: 290 }}
                />
            </View> */}
                        <TouchableOpacity style={{ marginLeft: 150 }} onPress={() => navigation.navigate("ForgotPassword")}>
                            <Text style={styles.forgot_button}>
                                Forgot Password
                            </Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={{ marginLeft:150 }} onPress={() => navigation.navigate("LoginWithOTP")}>
                            <Text style={styles.loginOTP_button}>
                                login with OTP?
                            </Text>
                        </TouchableOpacity> */}
                        {/* <TouchableOpacity style={styles.loginBtn} onPress={onSubmit}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity> */}



                        <CustomButton title={"LOGIN"} onSubmit={handleSubmit(onSubmit)} />
                        {/* </View> */}

                        <TouchableOpacity style={{  }} onPress={() => navigation.navigate("LoginWithOTP")}>
                            <Text style={styles.loginOTP_button}>
                                Login with OTP
                            </Text>
                        </TouchableOpacity>

                    </Container>
                </View>

            </View>
        </KeyboardAwareScrollView>

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
        fontSize:Dimensions.get("window").width > 600 ? 20:14,
        width: Dimensions.get("window").width > 600 ? "87%" :"100%" ,
        alignItems:"flex-end",
        marginBottom: 25,
        textAlign: "right",
    },
    loginOTP_button: {
        width: "100%",
        // alignItems:"center",
        marginBottom: 25,
        textAlign:"center",
        fontSize: Dimensions.get('window').width > 600 ? 20:14,
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
        marginBottom: Dimensions.get('window').width > 600 ? 35:10,
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
        // borderWidth: 5,
        // margin: 10,
        // marginTop:10
        // paddingTop: StatusBar.currentHeight,
    },
    icon: {
        width: Dimensions.get('window').width > 600 ? 400:250,
        height: Dimensions.get('window').width > 600 ? 180:100,
        // marginTop:10
    },
    formContainer: {
        flex: 1,
        marginTop: Dimensions.get('window').width > 600 ?0: Dimensions.get('window').height * 0.12,
        marginBottom: Dimensions.get('window').width > 600 ?Dimensions.get('window').height * 0.1: 0,

    },
    loginImgContainer: {
        resizeMode:'cover',
        alignItems: 'center',
        marginBottom: Dimensions.get('window').width > 600 ? Dimensions.get('window').height * 0.02: Dimensions.get('window').height * 0.04,
    },
    backgroundImg: {
        flex: 1,
        position: "absolute",
        width: Dimensions.get("window").width * 1,
        height: Dimensions.get("window").height * 1.1,
        justifyContent: 'center',
    }

});

export default LoginScreen;





// const response = await instance.post(serverUrl.login, raw);

// console.log("LOGIN RESPONSE", response.data);

// const userData = response.data.data;

// const authData = {
//     token: userData.token,
//     username: userData.username,
// };

// const user = {
//     username: userData.username,
//     godownHeadId: userData.userId,
//     godownId: userData.godownId,
//     role: userData.role,
// };


// catch (error) {
//     console.log("LOGIN ERROR", error);
//     console.log("LOGIN ERROR RESPONSE", error?.response?.data);

//     showMessage({
//         message: "Login Failed",
//         description:
//             error?.response?.data?.message ||
//             error?.message ||
//             "Unknown error",
//         type: "danger",
//     });
// }