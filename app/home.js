import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";

export default function home() {
  const [getChatArray, setChatArray] = useState([]);

  const [loaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL +
          "/SmartChat/LoadHomeData?id=" +
          user.id
      );
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          let chatArray = json.jsonChatArray;
          setChatArray(chatArray);
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && error) {
    return null;
  }
  return (
    <LinearGradient colors={["#859398", "#283048"]} style={stylesheet.view1}>
      <StatusBar hidden={true} />
      <FlashList
        data={getChatArray}
        renderItem={({ item }) => (
          <Pressable
            style={stylesheet.view5}
            onPress={() => {
              // Alert.alert("User", "User" + item.other_user_id);
              router.push({
                pathname: "/chat",
                params: item,
              });
            }}
          >
            <View
              style={
                item.other_user_status == 1
                  ? stylesheet.view6_2
                  : stylesheet.view6_1
              }
            >
              {item.avatar_image_found ? (
                <Image
                  style={stylesheet.image1}
                  source={
                    process.env.EXPO_PUBLIC_API_URL +
                    "/SmartChat/AvatarImages/" +
                    item.other_user_mobile +
                    ".png"
                  }
                  contentFit="cover"
                />
              ) : (
                <Text style={stylesheet.text6}>
                  {item.other_user_avatar_letters}
                </Text>
              )}
            </View>
            <View style={stylesheet.view4}>
              <Text style={stylesheet.text1}>{item.other_user_name}</Text>
              <Text style={stylesheet.text4} numberOfLines={1}>
                {item.message}
              </Text>
              <View style={stylesheet.view7}>
                <Text style={stylesheet.text5}>{item.dateTime}</Text>
                <AntDesign
                  name="check"
                  size={18}
                  color={item.chat_status_id == 1 ? "green" : "white"}
                />
              </View>
            </View>
          </Pressable>
        )}
        estimatedItemSize={200}
      />
    </LinearGradient>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  view2: {
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center",
  },
  view3: {
    width: 80,
    height: 80,
    backgroundColor: "red",
    borderRadius: 40,
  },
  view4: {
    flex: 1,
  },
  view5: {
    flexDirection: "row",
    marginVertical: 10,
    columnGap: 20,
    alignItems: "center",
  },
  view6_1: {
    width: 80,
    height: 80,
    borderStyle: "dotted",
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "red",
    borderRadius: 100,
    justifyContent: "center",
  },
  view6_2: {
    width: 80,
    height: 80,
    borderStyle: "dotted",
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "green",
    borderRadius: 100,
    justifyContent: "center",
  },
  view7: {
    flexDirection: "row",
    columnGap: 19,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text1: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  text2: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  text3: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    alignSelf: "flex-end",
  },
  text4: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  text5: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    alignSelf: "flex-end",
  },
  text6: {
    fontSize: 35,
    fontFamily: "Poppins-Bold",
    color: "#283048",
    alignSelf: "center",
  },
  image1: {
    width: 70,
    height: 70,
    borderRadius: 100,
    alignSelf: "center",
  },
});
