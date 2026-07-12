import { Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Container = ({ children }) => {
    return (
        <SafeAreaProvider>
            {/* <TopBar /> */}
            
            <View style={[styles.container]}>
                {children}
            </View>
      
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", 
        paddingVertical: Dimensions.get("window").height * 0.02,
        paddingHorizontal: Dimensions.get("window").width * 0.05,
    }
});

export default Container;