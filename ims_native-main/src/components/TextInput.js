import { Dimensions, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import ErrorText from "./ErrorText";
const CustomTextInput = ({
    label,
    placeholder,
    value,
    keyboardType,
    secureTextEntry,
    onChangeText,
    error,
    icon,
    position,
    disabled
 }) => {
    return (
        <View >
            <TextInput
                style={styles.input}
                label={label}
                disabled={disabled}
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                left={icon && position === "left" ? <TextInput.Icon icon={icon} /> : null}
                right={icon && position === "right" ? <TextInput.Icon icon={icon} /> : null}
                mode="outlined"
                outlineColor="#D3D3D3"
                activeOutlineColor='#077FB6'
               
                theme={{ roundness: Dimensions.get("window").scale * 5, }}
                />
                
                {error && <ErrorText errorMessage={error} />}
        </View>

    )
}

const styles = StyleSheet.create({
    input: {
        marginVertical: Dimensions.get("window").height * 0.01,
        marginHorizontal:Dimensions.get('window').width > 600 ?Dimensions.get('window').width*0.09:0, 
        // backgroundColor: "white",
        // padding:50,
    },
});

export default CustomTextInput;