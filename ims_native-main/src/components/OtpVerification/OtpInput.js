import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TextInput } from 'react-native';
import { Grid } from "../GlobalStyle";
import { useTheme } from 'react-native-paper';

const OtpInput = ({ otp, setOtp}) => {
  const [focusedInput, setFocusedInput] = useState(0); 
  const inputs = useRef([]);
  const theme = useTheme();

  const focusNextInput = (index) => {
    if (index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const focusPrevInput = (index) => {
    if (index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = ''; 
        setOtp(newOtp);
        focusPrevInput(index - 1);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };
  

  const handleOtpChange = (text, index) => {
    if (text && !isNaN(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
  
      if (text.length === 1) {
        focusNextInput(index);
      }
    }
  };

  const handleInputFocus = (index) => {
    setFocusedInput(index);
  };

  

  return (
    <View style={[styles.container, Grid.row]}>
      {[...Array(6)].map((_, index) => (
        <TextInput
          key={index}
          style={[styles.input, { borderColor: index === focusedInput ? theme.colors.buttonColor : theme.colors.disabled, backgroundColor: theme.colors.background, color: theme.colors.text1}]} 
          ref={(ref) => (inputs.current[index] = ref)}
          maxLength={1}
          keyboardType="numeric"
          value={otp[index]}
          onChangeText={(text) => handleOtpChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          onFocus={() => handleInputFocus(index)}   
          textContentType='oneTimeCode'
        />
      ))}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Dimensions.get('window').height * 0.02,
  },
  input: {
    width: Dimensions.get('window').width * 0.11,
    height: Dimensions.get('window').width * 0.11,
    marginHorizontal: Dimensions.get('window').width * 0.02,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default OtpInput;
