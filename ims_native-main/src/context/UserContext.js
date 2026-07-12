import createDataContext from "./createDataContext";
import serverUrl from "../api/urls";
import api from "../api/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Appearance} from 'react-native';

const initialState = {
    isDarkThemeOn: Appearance.getColorScheme()
}

const userReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_user':
            return { ...state, ...action.payload}

     
        case 'set_initial_theme':
            return { ...state, isDarkThemeOn: action.payload }

        default:
            state;
    }
}

const fetchUser = dispatch => async () => {
    return new Promise( async(resolve, reject) => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        api.get(`${serverUrl.getGodownHead}/${user.godownHeadId}`)
        
            .then(response => {
                dispatch({ type: 'fetch_user', payload: response.data });
                resolve(response.data);
            })
            .catch(error => {
                const errorResponse = JSON.stringify(error.response.data)
                reject(errorResponse);
            });
    });
}

const updateUser = dispatch => async (data) => {
    return new Promise((resolve, reject) => {
        api.put(serverUrl.updateGodownHead, {
            godownHeadId: data.godownHeadId,
            godownHeadName: data.name.toLowerCase(),
            email: data.email,
            godownheadNo: data.phoneNumber,
            address: data.address.toLowerCase(),
        })
            .then(response => {
                dispatch({ type: 'fetch_user', payload: response.data });
                resolve("Profile Updated");
            })
            .catch((error) => {
                const errorResponse = JSON.stringify(error.response.data).split(":")[1].replace(/"/g, "").replace("}", "").trim();
                reject(errorResponse);
            });
    });
}

const changePassword = dispatch => async (data) => {
    return new Promise((resolve, reject) => {
        api.put(serverUrl.updatePassword, data)
            .then(response => {
                resolve("Password Changed");
            })
            .catch(error => {
                const errorResponse = error.response.data;
                reject(errorResponse);
            });
    });
}

const sendOtp = dispatch => async (phoneNumber) => {
    return new Promise((resolve, reject) => {
        api.post(serverUrl.sendOtp, {
            godownheadNo: phoneNumber
        
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                const errorResponse = error.response.data;
                reject(errorResponse);
            });
    });
}

const verifyOtp = dispatch => async (data) => {
    return new Promise((resolve, reject) => {
        api.post(serverUrl.verifyOtp, data)
            .then(response => {
                resolve("OTP Verified");
            })
            .catch(error => {
                const errorResponse = error.response.data;
                reject(errorResponse);
            });
    });
}

// const toggleTheme = dispatch => async () => {
//     dispatch({ type: 'toggle_theme' });
// }

const setInitialTheme = dispatch => async(theme) => {
    dispatch({ type: 'set_initial_theme', payload: theme });
}


export const { Context, Provider } = createDataContext(
    userReducer,
    { fetchUser, updateUser, changePassword, sendOtp, verifyOtp, setInitialTheme },
    initialState
    
)