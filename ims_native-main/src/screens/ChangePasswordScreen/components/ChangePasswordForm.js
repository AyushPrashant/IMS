import { Controller, useForm } from "react-hook-form";
import Container from "../../../components/Container";
import { useNavigation } from "@react-navigation/core";
import { useContext, useState } from "react";
import CustomTextInput from "../../../components/TextInput";
import CustomButton from "../../../components/Button";
import { showMessage } from "react-native-flash-message";
import { Context as UserContext } from "../../../context/UserContext";
import { AuthContext } from "../../../context/authContext";

const ChangePasswordForm = ({ theme }) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)
    const { state, changePassword } = useContext(UserContext);
    const { handleLogout } = useContext(AuthContext);
    const { control, handleSubmit, formState: { errors }} = useForm({
        defaultValues: {
            username: state.username,
            oldPassword: "",
            newPassword: "",
        }
    });

    const onSubmit = (data) => {
        setLoading(true);
        changePassword(data)
        .then(() => {
            navigation.goBack();
            showMessage({
                message: "Success",
                description: "Password changed",
                type: "success",
            
            })
            handleLogout();
        })
        .catch((error) => {
            showMessage({
                message: "Failed",
                description: error,
                type: "danger",
            })
        })
        .finally (() => setLoading(false));
    }

    return (

        <Container>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextInput
                        label={"Old Password"}
                        placeholder={"Enter your old password"}
                        value={value}
                        keyboardType={"default"}
                        secureTextEntry={true}
                        onChangeText={value => onChange(value.trim())}
                        error={errors.oldPassword && errors.oldPassword.message}
                        icon={"lock"}
                        position={"left"}
                    />
                )}
                name="oldPassword"
                rules={{ 
                    required: '* required',
                }}
            />
            <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextInput
                            label={"New Password"}
                            placeholder={"Enter your new password"}
                            value={value}
                            keyboardType={"default"}
                            secureTextEntry={true}
                            onChangeText={value => onChange(value.trim())}
                            error={errors.newPassword && errors.newPassword.message}
                            icon={"lock"}
                            position={"left"}
                        />
                    )}
                    name="newPassword"
                    rules={{ 
                        required: '* required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters long'
                        },
                        pattern: {
                            value: /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z])(?=.*[0-9].*[0-9]).{8,}$/,
                            message: 'Password must contain at least 1 special character, 1 alphabet, and 2 numeric'
                        }
                    }
                }
                />
            <CustomButton title="Save" loading={loading} onSubmit={handleSubmit(onSubmit)} />
        </Container>

    )
}

export default ChangePasswordForm;