import { Dimensions, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useContext } from "react";
import { Context as UserContext } from "../../context/UserContext";
import OTPVerification from "../../components/OtpVerification/OTPVerification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ChangePasswordForm from "./components/ChangePasswordForm";
import { useTheme } from "react-native-paper";

const ChangePasswordScreen = () => {
    const [loading, setLoading] = useState(false)
    const { state } = useContext(UserContext);
    const [ isVerified, setIsVerified ] = useState(false);
    const theme = useTheme();
  
    return (
        <>
       <KeyboardAwareScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.formContainer}>
                {
                    !isVerified ?( <OTPVerification theme={theme} phoneNumber={state.godownheadNo} setIsVerified={(val) => setIsVerified(val)} /> ): (
                    <ChangePasswordForm theme={theme}  />
                    )
                    
                }
            </View>
       </KeyboardAwareScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
    },

    formContainer: {
        width: Dimensions.get("window").width * 1,

    },

});

export default ChangePasswordScreen;
