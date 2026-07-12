import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper"
import Container from "./Container";

const Spinner = ({animating, color, size}) => {
    return (
    <Container>
        <ActivityIndicator animating={animating} color={color} size={size} />
    </Container>
)
}

const styles = StyleSheet.create({})

export default Spinner;