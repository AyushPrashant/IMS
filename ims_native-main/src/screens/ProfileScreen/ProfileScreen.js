import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, Modal } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Container from "../../components/Container";
import { Avatar, Card, Switch, Text, useTheme } from "react-native-paper";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Grid } from "../../components/GlobalStyle"
import React, { useState, useContext } from "react";
import { Context as UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/authContext";
import Spinner from "../../components/Spinner";
import { color } from "react-native-elements/dist/helpers";

const getIcon = (iconName, iconLibrary) => {
    if (iconLibrary === "MaterialIcons") {
        return <MaterialIcons name={iconName} size={20} color="#64696E" />
    } else if (iconLibrary === "FontAwesome") {
        return <FontAwesome name={iconName} size={20} color="#64696E" />
    }
    else if (iconLibrary === "FontAwesome5") {
        return <FontAwesome5 name={iconName} size={20} color="#64696E" />
    }

}

const CardItem = ({ icon, fieldName, fieldValue, textColor1, textColor2 }) => {
    return (
        <View style={[styles.cardItem, Grid.row]}>
            <View style={[styles.itemLeft, Grid.row]}>
                {icon}
                <Text variant="bodySmall" style={{color: textColor1}} >{fieldName}</Text>
            </View>
            <Text variant="bodySmall" numberOfLines={1} style={[styles.itemRight, Grid['1col'] ,{color: textColor2}]}>{fieldValue}</Text>
        </View>
    )
}

function capitalizeFirstLetter(sentence) {
    const words = sentence.split(' ');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const capitalizedSentence = capitalizedWords.join(' ');
    return capitalizedSentence;
}

function avatarLabel(name) {

    return name.split(" ").map((word) => word.charAt(0)).join("").substring(0, 2);

}

const ProfileScreen = () => {
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const theme = useTheme();

    const navigation = useNavigation();
    const { state, fetchUser } = useContext(UserContext)
    const { handleLogout } = useContext(AuthContext);
    const [godownHeadId, setGodownHeadId] = useState(0);
    const [profile, setProfile] = useState({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
        address: "",
        role: ""
    });
    
    const updateState = (newData) => {
        setProfile((prevState) => ({ ...prevState, ...newData }));
    };

    const fetchProfile = (godownHeadId) => {
        fetchUser(godownHeadId)
            .then(response => {
                updateState({
                    godownHeadId: response.godownHeadId,
                    name: response.godownHeadName,
                    username: response.username,
                    email: response.email,
                    phoneNumber: response.godownheadNo,
                    role: response.role,
                    address: response.address
                });
            })
            .catch(error => {
                // console.log(error);
            })
            .finally(() => setLoading(false));;
    }


    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // const isFocused = useIsFocused();

    // useEffect(() => {
    //     fetchProfile(godownHeadId);
    // }, [isFocused]);
    useFocusEffect(
        React.useCallback(() => {
          // console.log("api response: " + cart2);
          fetchProfile(godownHeadId);

          // console.log(cart2);
        }, [])
      );

    return (
        <>
            {
                loading ? <Spinner animating={loading} size={"large"} color={theme.colors.loader} /> : (
                    <ScrollView showsVerticalScrollIndicator={false} style={[styles.profileContainer, {backgroundColor: theme.colors.background}]} >
                        <Container>
                           
                            <View style={styles.avatarView}>
                                <Avatar.Text style={[styles.avatar, {backgroundColor: theme.colors.avatar}]} size={100} label={avatarLabel(capitalizeFirstLetter(profile.name))} />
                                <Text variant="titleLarge" style={{color: theme.colors.text1}} >{capitalizeFirstLetter(profile.name)}</Text>
                                <Text variant="bodyMedium" style={{color: theme.colors.text1}} >{capitalizeFirstLetter(profile.role)}</Text>
                            </View>
                            <View style={Grid["2col"]}>
                                <View style={styles.cardContainer}>
                                    <Text variant="titleSmall" style={{color: theme.colors.text2}}>Personal Information</Text>
                                    <Card style={[styles.card, { backgroundColor: theme.colors.cardBackground}]}>
                                        <Card.Content>
                                            <CardItem
                                                icon={getIcon("alternate-email", "MaterialIcons")}
                                                fieldName="Username"
                                                fieldValue={profile.username ? profile.username : "Not Available"}
                                                textColor1={theme.colors.text1}
                                                textColor2={theme.colors.text2}
                                            />
                                            <CardItem
                                                icon={getIcon("email", "MaterialIcons")}
                                                fieldName="Email"
                                                fieldValue={profile.email ? profile.email : "Not Available"}
                                                textColor1={theme.colors.text1}
                                                textColor2={theme.colors.text2}
                                            />
                                            <CardItem
                                                icon={getIcon("phone", "MaterialIcons")}
                                                fieldName="Phone Number"
                                                fieldValue={profile.phoneNumber ? profile.phoneNumber : "Not Available"}
                                                textColor1={theme.colors.text1}
                                                textColor2={theme.colors.text2}
                                            />
                                            <CardItem
                                                icon={getIcon("location-on", "MaterialIcons")}
                                                fieldName="Address"
                                                fieldValue={profile.address ? capitalizeFirstLetter(profile.address) : "Not Available"}
                                                textColor1={theme.colors.text1}
                                                textColor2={theme.colors.text2}
                                            />
                                        </Card.Content>
                                    </Card>
                                </View>
                                <View style={styles.cardContainer}>
                                    <Text variant="titleSmall" style={{color: theme.colors.text2}}>Settings</Text>
                                    <Card style={[styles.card, { backgroundColor: theme.colors.cardBackground}]}>
                                        <Card.Content>
                                            <TouchableOpacity onPress={() => navigation.navigate("Edit Profile")}>
                                                <CardItem
                                                    icon={getIcon("edit", "MaterialIcons")}
                                                    fieldName="Edit Profile"
                                                    fieldValue={getIcon("chevron-right", "MaterialIcons")}
                                                    textColor1={theme.colors.text1}
                                                    textColor2={theme.colors.text2}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate("Change Password")} >
                                                <CardItem
                                                    icon={getIcon("password", "MaterialIcons")}
                                                    fieldName="Change Password"
                                                    fieldValue={getIcon("chevron-right", "MaterialIcons")}
                                                    textColor1={theme.colors.text1}
                                                     textColor2={theme.colors.text2}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={openModal}>
                                                <CardItem
                                                    icon={getIcon("logout", "MaterialIcons")}
                                                    fieldName="Log out"
                                                    fieldValue={getIcon("chevron-right", "MaterialIcons")}
                                                    textColor1={theme.colors.text1}
                                                     textColor2={theme.colors.text2}
                                                />
                                            </TouchableOpacity>
                                            <Modal
                                                visible={modalVisible}
                                                animationType="slide"
                                                transparent={true}
                                                onRequestClose={closeModal}
                                            >
                                                <View style={styles.modalContainer}>

                                                    <View style={[styles.modalContent, {backgroundColor: theme.colors.cardBackground}]}>

                                                        {/* <Image source={require('../../../assets/logout.png')} style={styles.modalimage}></Image>
                                                        <Text style={styles.modalText}>Oh no! You're leaving...</Text> */}
                                                        <View>
                                                            <Text style={[styles.modalText, {color: theme.colors.text1}]}>Are you sure you want to logout?</Text>
                                                        </View>
                                                        {/* <View>
                                                            <Text style={styles.modalText2}></Text>
                                                        </View> */}


                                                        <View style={styles.modalButtonsContainer}>
                                                            <View>
                                                                <TouchableOpacity onPress={closeModal} style={[styles.modalButton1, {backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.buttonColor}]}>
                                                                    <Text style={[styles.buttonText1, {color: theme.colors.text1}]}>Cancel</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View>
                                                                <TouchableOpacity onPress={handleLogout} style={[styles.modalButton, {backgroundColor: theme.colors.buttonColor}]}>
                                                                    <Text style={[styles.buttonText]}>Logout</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>

                                                </View>
                                            </Modal>


                                        </Card.Content>
                                    </Card>
                                </View>
                            </View>
                        </Container>
                    </ScrollView>
                )
            }
        </>
    )
}

const styles = StyleSheet.create({
    profileContainer: {
        paddingTop: Dimensions.get("window").height * 0.04,
    },
    themeSwitch: {
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center",
        gap: Dimensions.get("window").height * 0.01,
    },
   
    avatarView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: Dimensions.get("window").height * 0.02,
    },
    avatar: {
        marginBottom: Dimensions.get("window").height * 0.02,
    },
    cardContainer: {
        gap: Dimensions.get("window").height * 0.01,
        marginBottom: Dimensions.get("window").height * 0.02,

    },

    cardItem: {
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: Dimensions.get("window").height * 0.01,
        gap: Dimensions.get("window").width * 0.1,
    },
    itemLeft: {
        gap: Dimensions.get("window").width * 0.02,
        alignItems: "center",
    },
    itemRight: {
        textAlign: "right",
    },
   
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // margin:10,
        padding: 20,
    },
    modalContent: {

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 20,


    },

    modalimage: {
        alignItems: 'center',
        height: 60,
        width: 60,
        resizeMode: 'contain',
        marginBottom: 25,

    },
    modalText: {
        fontSize: 17,
        fontWeight: '700',
    },
    modalText2: {
        color: 'rgb(100,105,110)',

    },
    modalButtonsContainer: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-between',
        marginTop: 15,
        gap: Dimensions.get('window').width * 0.05,
        width: '90%'

    },
    modalButton: {
        height: Dimensions.get('window').height * 0.05,
        width: Dimensions.get('window').width * 0.35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalButton1: {
        height: Dimensions.get('window').height * 0.05,
        width: Dimensions.get('window').width * 0.35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1

    },
    buttonText: {
        fontSize: 15,
        color: 'white',
    
    },
    buttonText1: {
        fontSize: 15,
    },

});

export default ProfileScreen;