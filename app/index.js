import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import * as SplashScreen from "expo-splash-screen";
import { Stack, Tabs, Link, router } from "expo-router";
import { Image } from "expo-image";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FontAwesome,
  FontAwesome6,
  FontAwesome4,
  FontAwesome5,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { registerRootComponent } from "expo";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function index() {
  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getName, setName] = useState("");

  const [loaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    async function checkUserInAsyncStorage() {
      try {
        let userJson = await AsyncStorage.getItem("user");
        if (userJson != null) {
          router.replace("/home");
        }
      } catch (error) {
        console.log(e);
      }
    }
    checkUserInAsyncStorage();
  }, []);

  if (!loaded && error) {
    return null;
  }

  const logoPath = require("../assets/logo.png");

  return (
    <LinearGradient colors={["#859398", "#283048"]} style={stylesheet.view1}>
      <StatusBar hidden={true} />
      <ScrollView>
        <View style={stylesheet.view2}>
          <Image source={logoPath} style={stylesheet.image1} />
          <Text style={stylesheet.text1}>Create Account</Text>
          <Text style={stylesheet.text2}>Hello ! Welcome to Smart Chat</Text>
          <View style={stylesheet.avatar1}>
            <Text style={stylesheet.text5}>{getName}</Text>
          </View>
          <Text style={stylesheet.text3}>Mobile</Text>
          <TextInput
            style={stylesheet.input1}
            inputMode="tel"
            maxLength={10}
            onChangeText={(text) => {
              setMobile(text);
            }}
            onEndEditing={async () => {
              if (getMobile.length == 10) {
                let response = await fetch(
                  process.env.EXPO_PUBLIC_API_URL +
                    "/SmartChat/GetLetters?mobile=" +
                    getMobile
                );
                if (response.ok) {
                  let json = await response.json();
                  setName(json.letters);
                }
              }
            }}
          />

          <Text style={stylesheet.text3}>Password</Text>
          <TextInput
            style={stylesheet.input1}
            secureTextEntry={true}
            inputMode="text"
            maxLength={20}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
          <Pressable
            style={stylesheet.pressable1}
            onPress={async () => {
              let formData = new FormData();
              formData.append("mobile", getMobile);
              formData.append("password", getPassword);

              let response = await fetch(
                process.env.EXPO_PUBLIC_API_URL + "/SmartChat/SignIn",
                {
                  method: "POST",
                  body: JSON.stringify({
                    mobile: getMobile,
                    password: getPassword,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              if (response.ok) {
                let json = await response.json();
                if (json.success) {
                  try {
                    await AsyncStorage.setItem(
                      "user",
                      JSON.stringify(json.user)
                    );
                    router.replace("/home");
                  } catch (error) {
                    Alert.alert("Error", "Unable to process your request");
                  }
                } else {
                  Alert.alert("Error", json.message);
                }
              }
            }}
          >
            <Text style={stylesheet.text4}>Sign In</Text>
            <MaterialIcons name="account-circle" size={24} color="white" />
          </Pressable>
          <Pressable
            style={stylesheet.pressable2}
            onPress={() => {
              router.replace("/signup");
            }}
          >
            <Text style={stylesheet.text4}>No Account ? Sign Up</Text>
            <AntDesign name="login" size={24} color="white" />
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "center",
  },
  text1: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  text2: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
    color: "white",
  },
  text3: {
    fontSize: 16,
    fontFamily: "Poppins-Light",
    color: "white",
  },
  text4: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "white",
  },
  input1: {
    width: "100%",
    height: 50,
    fontSize: 15,
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 15,
    paddingStart: 15,
    color: "white",
  },
  pressable1: {
    height: 50,
    backgroundColor: "#0B2F9F",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    columnGap: 10,
  },
  pressable2: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    columnGap: 10,
  },
  image1: {
    width: 110,
    height: 100,
    alignSelf: "center",
  },
  image2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  avatar1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center",
  },
  text5: {
    fontSize: 40,
    fontFamily: "Poppins-Bold",
    color: "#283048",
    alignSelf: "center",
  },
  view2: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    rowGap: 5,
  },
});
