import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from "../pages/HomeScreen";
import FavoriteScreen from "../pages/FavoriteScreen";
const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <AntDesign
                name="home"
                size={22}
                color={focused ? "#3CB371" : "gray"}
              />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "#3CB371" : "gray", fontSize: 12 }}>Home</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialIcons
                name="favorite-border"
                size={22}
                color={focused ? "#3CB371" : "gray"}
              />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "#3CB371" : "gray", fontSize: 12 }}>Favorite</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;

const styles = StyleSheet.create({});
