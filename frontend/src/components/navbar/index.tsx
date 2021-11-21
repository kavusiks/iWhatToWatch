import * as React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../services/hooks";
import { Dispatch } from "redux";
import { setSearchQuery } from "../../pages/mainPageSlice";
import { logOut } from "../login/loginslice"
import { selectUserIsLoggedIn } from "../../services/selectors";
import { useState } from "react";
import SignIn from "../login";
import { Appbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useFonts, Quicksand_600SemiBold} from '@expo-google-fonts/quicksand';
import AppLoading from "expo-app-loading";
import LoginModal from "../login/login";

const actionDispatch = (dispatch: Dispatch) => ({
  setSearch: (query: string) => dispatch(setSearchQuery(query)),
  setLogOut: () => dispatch(logOut()),
});

interface NavBarProps{
  isLoginModalVisible:boolean;
  onCloseClick: () => void;
}

/**
 * This is the header for our app. We use AppBar component from MUI.
 * The component both have the search function and userLogIn.
 * 
 * @param isLoginModalVisible, onCloseClick 
 * @returns header to show.
 */
const NavBar: React.FC<NavBarProps> = ({isLoginModalVisible, onCloseClick}) => {
  const [localSearch, setLocalSearch] = React.useState<string>("");
  const { setSearch, setLogOut} = actionDispatch(useAppDispatch());
  const isLoggedIn = useSelector(selectUserIsLoggedIn)

  let [fontsLoaded] = useFonts({
    'Quicksand-SemiBold': require('../../assets/fonts/Quicksand-SemiBold.ttf'),
  })

  if (!fontsLoaded) {
    return (<AppLoading />)
  }
  else {
    return (
      <Appbar.Header style={{backgroundColor:'black'}}>
        <Appbar.Action icon="menu" />
        <Appbar.Content title="What To Watch?" titleStyle={{fontFamily:'Quicksand-SemiBold', fontSize:30}}/>
        <Appbar.Action icon="account" onPress={onCloseClick} />
      </Appbar.Header>
    );
  }
}

export default NavBar;

