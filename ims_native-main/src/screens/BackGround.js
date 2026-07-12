import React from "react";
import { View,ImageBackground } from "react-native";

const Background=({childern})=>{
    return (
        <View>
            <ImageBackground source={require("../../assets/ev1.png")} style={{ height:'100%'}}/>
            <View style={{position:'absolute'}}>{childern}</View>
        </View>
    );
}

export default Background;