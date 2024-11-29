import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function chat() {
  //create state for chatArray
  const [getChatArray, setChatArray] = useState([]);
  const [getChatText, setChatText] = useState("");

  const item = useLocalSearchParams();

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
    async function fetchChatArray() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      let response = await fetch(
        process.env.EXPO_PUBLIC_API_URL +
          "/SmartChat/LoadChat?logged_user_id=" +
          user.id +
          "&other_user_id=" +
          item.other_user_id
      );

      if (response.ok) {
        let chatArray = await response.json();
        setChatArray(chatArray);
      }
    }
    fetchChatArray();
    setInterval(() => {
      fetchChatArray();
    }, 1000);
  }, []);

  if (!loaded && error) {
    return null;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={stylesheet.container}
    >
      <LinearGradient colors={["#859398", "#283048"]} style={stylesheet.view1}>
        <StatusBar hidden={true} />
        <View style={stylesheet.view2}>
          <View style={stylesheet.view3}>
            {item.avatar_image_found == "true" ? (
              <Image
                source={
                  process.env.EXPO_PUBLIC_API_URL +
                  "/SmartChat/AvatarImages/" +
                  item.other_user_mobile +
                  ".png"
                }
                contentFit="cover"
                style={stylesheet.image1}
              />
            ) : (
              <Text style={stylesheet.text1}>
                {item.other_user_avatar_letters}
              </Text>
            )}
          </View>
          <View style={stylesheet.view4}>
            <Text style={stylesheet.text2}>{item.other_user_name}</Text>
            <Text style={stylesheet.text3}>
              {item.other_user_status == 1 ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View style={stylesheet.centerview1}>
          <FlashList
            data={getChatArray}
            renderItem={({ item }) => (
              <View
                style={
                  item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2
                }
              >
                <Text style={stylesheet.text4} numberOfLines={1}>
                  {item.message}
                </Text>
                <View
                  style={
                    item.side == "right"
                      ? stylesheet.view6_1
                      : stylesheet.view6_1
                  }
                >
                  <Text style={stylesheet.text5}>{item.datetime}</Text>
                  {item.side == "right" ? (
                    item.status == "1" ? (
                      <FontAwesome5
                        name="check-double"
                        size={15}
                        color={"blue"}
                      />
                    ) : (
                      <AntDesign name="check" size={15} color="white" />
                    )
                  ) : null}
                </View>
              </View>
            )}
            estimatedItemSize={200}
          />
        </View>

        <View style={stylesheet.view7}>
          <TextInput
            style={stylesheet.input1}
            inputMode="text"
            value={getChatText}
            onChangeText={(text) => {
              setChatText(text);
            }}
          />
          <Pressable
            style={stylesheet.pressable1}
            onPress={async () => {
              if (getChatText.length == 0) {
                Alert.alert("Error", "Please Enter A Message");
              } else {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch(
                  process.env.EXPO_PUBLIC_API_URL +
                    "/SmartChat/SendChat?logged_user_id=" +
                    user.id +
                    "&other_user_id=" +
                    item.other_user_id +
                    "&message=" +
                    getChatText
                );
                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    console.log("Message Sent");
                    setChatText("");
                  }
                }
              }
            }}
          >
            <FontAwesome name="send-o" size={24} color="white" />
          </Pressable>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  view1: {
    flex: 1,
  },
  view2: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    columnGap: 20,
  },
  view3: {
    backgroundColor: "green",
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  image1: {
    width: 70,
    height: 70,
    borderRadius: 100,
    alignSelf: "center",
  },
  text1: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
  },
  view4: {},
  text2: {
    fontSize: 25,
    fontFamily: "Poppins-Bold",
  },
  text3: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
  },
  view5_1: {
    backgroundColor: "#859398",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  view5_2: {
    backgroundColor: "#859398",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  view6_1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 10,
  },
  view6_2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 10,
  },
  text4: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
  },
  text5: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  view7: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    marginVertical: 15,
    columnGap: 10,
  },
  input1: {
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    flex: 1,
    paddingStart: 20,
  },
  pressable1: {
    backgroundColor: "#9DBDFF",
    borderRadius: 50,
    padding: 10,
  },
  centerview1: {
    flex: 1,
    marginVertical: 15,
  },
});
