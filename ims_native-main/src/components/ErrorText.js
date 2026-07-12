import { Dimensions, StyleSheet } from "react-native"
import { Text, useTheme } from "react-native-paper"

const ErrorText = ({errorMessage}) => {
    const theme = useTheme();
    return <Text variant="bodyMedium" style={[styles.error, {color: theme.colors.error}]}>{errorMessage}</Text>
}

const styles = StyleSheet.create({
    error: {
        marginBottom: Dimensions.get("window").height*0.02,
        marginLeft:Dimensions.get("window").width > 600 ? Dimensions.get("window").width*0.1:10,
    }
})

export default ErrorText;