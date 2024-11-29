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
import {
  FontAwesome,
  FontAwesome6,
  FontAwesome4,
  FontAwesome5,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function signup() {
  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

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
          <Pressable
            style={stylesheet.avatar1}
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({});

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
          >
            <Image
              source={getImage}
              style={stylesheet.image2}
              contentFit="container"
            />
          </Pressable>
          <Text style={stylesheet.text3}>Mobile</Text>
          <TextInput
            style={stylesheet.input1}
            inputMode="tel"
            maxLength={10}
            onChangeText={(text) => {
              setMobile(text);
            }}
          />
          <Text style={stylesheet.text3}>First Name</Text>
          <TextInput
            style={stylesheet.input1}
            inputMode="text"
            onChangeText={(text) => {
              setFirstName(text);
            }}
          />
          <Text style={stylesheet.text3}>Last Name</Text>
          <TextInput
            style={stylesheet.input1}
            inputMode="text"
            onChangeText={(text) => {
              setLastName(text);
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
              formData.append("firstname", getFirstName);
              formData.append("lastname", getLastName);
              formData.append("password", getPassword);
              formData.append("avatarImage", {
                type: "image/png",
                uri: getImage,
              });

              let response = await fetch(
                process.env.EXPO_PUBLIC_API_URL + "/SmartChat/SignUp",
                {
                  method: "POST",
                  body: formData,
                }
              );
              if (response.ok) {
                let json = await response.json();
                if (json.success) {
                  router.replace("/");
                } else {
                  Alert.alert("Error", json.message);
                }
              }
            }}
          >
            <Text style={stylesheet.text4}>Sign Up</Text>
            <MaterialIcons name="account-circle" size={24} color="white" />
          </Pressable>
          <Pressable
            style={stylesheet.pressable2}
            onPress={() => {
              router.replace("/");
            }}
          >
            <Text style={stylesheet.text4}>Already Registered ? Sign In</Text>
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
  view2: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    rowGap: 5,
  },
});
