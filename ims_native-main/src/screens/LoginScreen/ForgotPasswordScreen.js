import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, TouchableOpacity,
   Dimensions, ImageBackground,

} from "react-native";
import { Text, Snackbar, IconButton, useTheme } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import instance from "../../api/axiosConfig";
import api from "../../api/axiosConfig";
import serverUrl from "../../api/urls";
import Container from "../../components/Container";
import CustomTextInput from "../../components/TextInput";
import CustomButton from "../../components/Button";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage } from 'react-native-flash-message';
import { useForm, Controller } from 'react-hook-form';
import { Grid } from "../../components/GlobalStyle";
import { Context as UserContext } from "../../context/UserContext";




const ForgotPasswordScreen = () => {
  const { state } = useContext(UserContext);
  const theme = useTheme();
  const [countdown, setCountdown] = useState(0);
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { control, formState: { errors } } = useForm();
  const [otp, setOTP] = useState('');
  const [otpsent, setOtpsent] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState({
    phone: '',
    otp: ''
  });


  const handleForgotPassword = async () => {
    try {
      const phoneRegex = /^\d[-\s()0-9]+$/;
      setError({ phone: { message: "" }, otp: { message: "" } });
      if (!phoneRegex.test(phone) || phone.length !== 10) {
          // Display error message if phone number is invalid
          setError({ phone: { message: "Phone number is required and must be of 10 digits." } });
          return;
      }
      const response = await instance.post(serverUrl.sendOtp, { "godownheadNo": phone });
      // console.log(response.data); // Assuming the backend returns the OTP

      // Display success message
      // Alert.alert('Success', 'OTP has been sent to your phone number.');
      showMessage({
        message: "Success",
        description: "OTP has been sent to your phone number successfully",
        type: "success",
      });
      setOtpsent(true)
      setCountdown(30)
      setSnackbarVisible(true);
      setSnackbarMessage(`OTP received on your no is ${response.data}`);

      // Navigate to the OTP verification screen or handle it as per your UI flow
      // navigation.navigate('ResetPasswordScreen', { phone });
    } catch (error) {
      // console.error('Error sending OTP:', error.response);
      // Alert.alert('Error', 'Failed to send OTP. Please try again.');
      showMessage({
        message: "Failed",
        description: error.response.data,
        type: "danger",
      });
    }
  };



  const verifyOtp = async (data) => {
    try {
      // console.log(phone, otp)
      const phoneRegex = /^\d[-\s()0-9]+$/;
      const otpRegex = /^\d{6}$/;
      setError({ phone: { message: "" }, otp: { message: "" } });
      if (!phoneRegex.test(phone) || phone.length !== 10) {
          // Display error message if phone number is invalid
          setError({ phone: { message: "Phone number is required and must be of 10 digits." } });
      }
      
      if (!otpRegex.test(otp) || otp.length !== 6) {
          setError({ otp: { message: "OTP is required and must be of 6 digits." } });
      }
      const response = await api.post(serverUrl.verifyOtp, {
        "godownheadNo": phone,
        "otp": otp
      });
      return "OTP Verified";
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      } else {
        throw error;
      }
    }
  };
  const onSubmit = () => {
    verifyOtp()
      .then(response => {
        navigation.navigate('ResetPasswordScreen', { phone });
        showMessage({
          message: "Success",
          description: response,
          type: "success",
        });
        
      })
      .catch(error => {
        // console.error("Error verifying OTP:", error);
        showMessage({
          message: "Error",
          description: error,
          type: "danger",
        });
      })

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


  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow",
  //     () => {
  //       setKeyboardOpen(true);
  //     });
  //   const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide",
  //     () => {
  //       setKeyboardOpen(false);
  //     });

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   }
  // }, []);

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
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <ImageBackground  source={    state.isDarkThemeOn === 'dark'                                       
                                             ? require('../../../assets/background-dark.png')
                                             : require('../../../assets/background.png')
                                         }
            resizeMode="cover"
            style={styles.backgroundImg}></ImageBackground>
          <View style={styles.formContainer}>
            <Container>
              {/* {!keyboardOpen && (
              <View style={styles.loginImgContainer}>
                <Image
                  source={require('../../../assets/LogoPyramid.png')}
                  style={styles.icon}
                />
              </View>
            )} */}

              <Text style={styles.welcomeText}>Forgot Password </Text>
              <Text style={styles.extraText}>Enter your registered phone number</Text>


              {/* <View style={styles.inputView}>
        <PaperInput
          mode="outlined"
          label="Phone Number"
          value={phone}
          onChangeText={(phone) => setPhone(phone)}
          style={{ width: 290 }}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
      </View> */}

              {/* <CustomTextInput
              label={"Phone Number"}
              value={phone}
              placeholder={"Enter your Phone number"}
              keyboardType="phone-pad"
              icon={"phone"}
              position={"left"}
              onChangeText={(phone) => {
                setPhone(phone)
              }} /> */}


              <Controller
                control={control}
                rules={{
                  required: 'Phone number is required',
                  pattern: {
                    value: /^\d[-\s()0-9]+$/,
                    message: 'Numbers only'
                  },
                  validate: value => value.replace(/[^\d]/g, '').length === 10 || 'Must be 10 digits'
                }}
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
              />


              <Controller
                control={control}
                rules={{
                  required: 'OTP is required',
                  pattern: {
                    value: /^\d[-\s()0-9]+$/,
                    message: 'Numbers only'
                  }
                }}
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
              />



              {/* <TouchableOpacity style={styles.forgot_button} onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.buttonText}>
          Back to Login
        </Text>
      </TouchableOpacity> */}


              {
                countdown > 0 ? (
                  <Text variant="bodyMedium" style={styles.timer}>
                    Resend OTP in <Text style={[styles.timer, { color: countdown < 15 ? "green" : "black", fontWeight: 'bold' }]}>{formattedTime}</Text>
                  </Text>
                ) : (
                  <TouchableOpacity style={{ marginLeft: 150 }} onPress={handleForgotPassword}>
                    <Text style={styles.forgot_button}>
                      {!otpsent ? "Send OTP" : "Resend OTP"}
                    </Text>
                  </TouchableOpacity>
                )
              }



              <CustomButton disabled={!otpsent} title={"Verify OTP"} onSubmit={onSubmit} />


              {/* <TouchableOpacity style={styles.loginBtn} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity> */}
              {/* </View> */}
            </Container>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // formContainer: {
  //   // width: Dimensions.get("window").width * 1,
  // },
  scrollContainer: {
    // borderWidth: 5,
    flex: 1,
  },
  logo: {
    width: 360, // Adjust the width as needed
    height: 290, // Adjust the height as needed
    marginBottom: 20, // Adjust the margin as needed
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    position: "absolute",
    top: Dimensions.get('window').height * 0.00008,
    borderRadius: 15

  },
  inputView: {
    backgroundColor: "#87ceeb",
    borderRadius: 5,
    height: 40,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  forgot_button: {
    fontSize:Dimensions.get("window").width > 600 ? 20:14,
    width: Dimensions.get("window").width > 600 ? "87%" :"100%", 
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
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  welcomeText: {
    // marginTop: 50,
    // marginBottom: 10,
    fontSize: Dimensions.get('window').width > 600 ? 35 : 21,
    textAlign: "center"
  },
  extraText: {
    marginBottom: Dimensions.get('window').width > 600 ? 35:10,
    fontSize: Dimensions.get('window').width > 600 ? 26 : 18,
    textAlign: "center"
  },
  mainContainer: {
    backgroundColor: '#fff',
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").width * 1.6,
    // flex: 1,
    // paddingTop: StatusBar.currentHeight,
  },
  icon: {
    width: 250,
    height: 100,
    // alignSelf: "center"
  },
  formContainer: {
    flex: 1,
    marginTop: Dimensions.get('window').height * 0.12,
  },
  loginImgContainer: {

    alignItems: 'center',
    marginBottom: Dimensions.get('window').height * 0.08,
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
    marginRight:Dimensions.get("window").width > 600 ?Dimensions.get("window").width*0.09:0,
    fontSize:Dimensions.get("window").width > 600 ? Dimensions.get("window").width*0.02: 14,
  },
  snackbarMessage: {
    bottom: Dimensions.get("window").height * 0.85,
    zIndex: 1,
  }
});

export default ForgotPasswordScreen;