import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Snackbar, Text, Title, IconButton, useTheme } from "react-native-paper";
import Container from "../Container";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Grid } from "../GlobalStyle";
import OtpInput from "./OtpInput";
import CustomButton from "../Button";
import ErrorText from "../ErrorText";
import { Context as UserContext } from "../../context/UserContext";
import { showMessage } from "react-native-flash-message";

const OTPVerification = ({ phoneNumber, setIsVerified }) => {
  const theme = useTheme();
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false)
  const [resentLoader, setResentLoader] = useState(false)
  const [error, setError] = useState("");
  const { sendOtp, verifyOtp } = useContext(UserContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const generateOtpString = () => {
    return otp.join('');
  };

  const onSubmit = () => {
    const otpString = generateOtpString();
    if(otpString.length < 6) {
      setError("Please enter a valid OTP");
      return;
    }

    setLoading(true);

    verifyOtp({ godownheadNo: phoneNumber, otp: otpString })
    .then(({ success, otp }) => {
      setIsVerified(true);
      showMessage({
        message: "Success",
        description: "Otp verified",
        type: "success",
      })
     
    })
    .catch((error) => {
      // setError(error);
      showMessage({
        message: "Failed",
        description: error,
        type: "danger",
      })
      
    })
    .finally(() => setLoading(false));
  }


;

  const sendOtpHandler = (phoneNumber) => {
    setResentLoader(true);
    setLoading(false);
    sendOtp(phoneNumber)
    .then((response) => {
        showMessage( {
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

  useEffect(() => {
    sendOtpHandler(phoneNumber);
  }, []);
    

  const handleResendOTP = () => {
    sendOtpHandler(phoneNumber);
   
  };
  

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${seconds.toString().padStart(2, "0")}`;

  return (
    <>
      <View style={{flex: 1, marginTop: Dimensions.get('window').height*0.03}}>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={30000} 
        style={[styles.snackbarMessage, {backgroundColor: theme.colors.snackbar, opacity:1}]} 
      >
        <View style={[Grid.row, {alignItems: "center"}]}>
          <View style={Grid["1col"]}>
            <Text style={{color: "white"}}> {snackbarMessage} </Text>
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
      <Container>
        <Title variant="titleLarge" style={[styles.heading, {color: theme.colors.text1, fontWeight:'bold'}]}>
          OTP Verification
        </Title>
        <Text variant="bodyMedium" style={[styles.subheading, {color: theme.colors.text1}]}>
          Please enter the 6-digit code sent to your mobile number ending with <Text variant="titleMedium" style={[styles.subheading, {color: theme.colors.text1}]}>{phoneNumber.slice(-4)}</Text>
        </Text>
        
        
        <OtpInput otp={otp} setOtp={setOtp} />
        {
          error.length>1 && (
              <ErrorText errorMessage={error} />
          )
        }
      
        {countdown>0 ? <View style={styles.resendOtpView}><Text variant="bodyMedium" 
        style={[styles.timer, {color: theme.colors.text2}]}
        >Resend OTP in {formattedTime}</Text></View> : <View style={styles.resendOtpView}></View>}
      
        {countdown === 0 && (
        <View style={[Grid.row, styles.resendView]}>
          
          <Text variant="bodyMedium" style={{color: theme.colors.text1}}> Didn't receive the OTP? </Text>
          { resentLoader ? (<ActivityIndicator animating={resentLoader} size={"small"} color={theme.colors.loader} />) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text variant="bodyMedium" style={{ color: theme.colors.text1,fontWeight:'bold' }}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </View>
        )}
        <CustomButton title={"Verify"} loading={loading} onSubmit={onSubmit} />
      
      </Container>
      </View>
      </>
    
  );
};

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
    marginVertical: Dimensions.get("window").height * 0.01,
  },

  subheading: {
    textAlign: "center",
    marginTop: Dimensions.get("window").height * 0.02,
    marginBottom: Dimensions.get("window").height * 0.05,
  },

  timer: {
    textAlign: "center",
    marginVertical: Dimensions.get("window").height * 0.02,
  },

  resendView: {
    justifyContent: "center",
    marginVertical: Dimensions.get("window").height * 0.02,
    alignItems: "center",
  },
  resendOtpView:{
    justifyContent: "center",
    marginVertical: Dimensions.get("window").height * 0.02,
    alignItems: "center",
  },


  hyperLink: {
    textAlign: "center",
    color: "blue",
  },
  snackbarMessage: { 
    bottom: Dimensions.get("window").height * 0.45,
     zIndex: 1 ,
  }
});

export default OTPVerification;
