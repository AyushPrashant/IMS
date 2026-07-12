import { Card, Text, useTheme } from 'react-native-paper';
import { FontAwesome, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Grid } from "./GlobalStyle";

const getIcon = (iconName, iconLibrary, iconColor) => {
    if(iconLibrary === "MaterialIcons") {
        return <MaterialIcons name={iconName} size={20} color={iconColor ? iconColor : "black"} />
    } else if(iconLibrary === "FontAwesome") {
        return <FontAwesome name={iconName} size={25} color={iconColor ? iconColor : "black"} />
    }
    else if(iconLibrary === "FontAwesome5") {
        return <FontAwesome5 name={iconName} size={15} color={iconColor ? iconColor : "black"} />
    }
    else if(iconLibrary === "MaterialCommunityIcons"){
        return <MaterialCommunityIcons name={iconName} size={32} color={iconColor ? iconColor : "black"} />
    }

}

const CustomCardTitle = ({iconName, iconLibrary, iconColor}) => {
    return (
      <Card.Title
        left={() => {
                return (
                    <View style={styles.iconStyle}>
                        {getIcon(iconName, iconLibrary, iconColor)}
                    </View>
                )
            }
        }
      />
    );
  };

const CardComponent = ({ title, description, iconName, iconLibrary, theme }) => {
    return (
        <>
        <Card style={[Grid['1col'], styles.cardStyle, { backgroundColor: theme.colors.cardBackground }]}>
            <CustomCardTitle iconName={iconName} iconLibrary={iconLibrary} iconColor={theme.colors.text1}/>
            <Card.Content>
                <Text variant="titleMedium" style={{color: theme.colors.text1}}>{title}</Text>
                <Text variant="bodySmall" style={{color: theme.colors.text1}}>{description}</Text>
            </Card.Content>
        </Card>
        </>
    )
}

const styles = StyleSheet.create({
    cardStyle: {
        minWidth: Dimensions.get("window").width * 0.4,
    },
    iconStyle: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default CardComponent;