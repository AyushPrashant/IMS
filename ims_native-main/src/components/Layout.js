import { SafeAreaProvider } from "react-native-safe-area-context";
import TopBar from "./Topbar";

const Layout = ({ children, route }) => {
    return (
        <SafeAreaProvider>
            <TopBar route={route} />
            {children}
        </SafeAreaProvider>
    )
}



export default Layout;