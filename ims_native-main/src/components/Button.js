import {  Dimensions, StyleSheet, View } from "react-native"
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";

const CustomButton = ({ title , onSubmit, loading, disabled }) => {
    const theme = useTheme();
    return (
        <View style={styles.buttonContainer}>
            {
                loading ? <ActivityIndicator animating={true} color={theme.colors.loader} size={"small"} /> : 

                <Button style={[styles.button, { backgroundColor: disabled ? "#C7C8CC": theme.colors.buttonColor}]} onPress={onSubmit} disabled={disabled} >
                    <Text style={{color: "white", fontWeight:600,fontWeight:'bold',fontSize:Dimensions.get('window').width > 600 ?20:17,}} variant="bodyMedium" >{title}</Text>
                </Button>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: Dimensions.get("window").height * 0.02,
        alignItems: "center",
       
    },

    button: {
        borderRadius: Dimensions.get('window').height*0.03,
        width: Dimensions.get("window").width * 0.5 ,
        height:Dimensions.get('window').height*0.06,
        justifyContent:'center'
    }
});

export default CustomButton;