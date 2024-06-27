import {
  Image,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [orchids, setOrchids] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigation();

  const fetchDataOrchids = async () => {
    try {
      const response = await fetch(
        "https://667a6d77bd627f0dcc8ee044.mockapi.io/api/v1/categories"
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      const favorites = await AsyncStorage.getItem("favorites");
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      
      const formattedData = data.map((category) => ({
        title: category.name,
        data: Array.isArray(category.items)
          ? category.items.map((item) => ({
              ...item,
              isFavorite: favoritesArray.some(
                (favorite) => favorite && favorite.name === item.name
              ),
            }))
          : [],
      }));

      formattedData.forEach(category => {
        console.log("Category Data: ", category.data);
      });
      
      setOrchids(formattedData);
   
    } catch (error) {
      console.error("Error fetching data: ", error);
      setOrchids([]);
    }
  };
  
  
  // const fetchDataOrchids = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://667a6d77bd627f0dcc8ee044.mockapi.io/api/v1/categories"
  //     );
  //     const favorites = await AsyncStorage.getItem("favorites");
  //     const favoritesArray = favorites ? JSON.parse(favorites) : [];
  //     const formattedData = response.data.map((category) => ({
  //       title: category.name,
  //       data: Array.isArray(category.items)
  //         ? category.items.map((item) => ({
  //             ...item,
  //             isFavorite: favoritesArray.some(
  //               (favorite) => favorite && favorite.name === item.name
  //             ),
  //           }))
  //         : [],
  //     }));
  //     setOrchids(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //     setOrchids([]);
  //   }
  // };

  // console.log("ORCHIDS: ", orchids);

  const saveFavoriteOrchid = async (orchid) => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = favorites ? JSON.parse(favorites) : [];

      let isFavorite =
        orchid && orchid.name
          ? favoritesArray.some((favorite) => favorite && favorite.name === orchid.name)
          : false;

      if (isFavorite) {
        favoritesArray = favoritesArray.filter(
          (favorite) => favorite.name !== orchid.name
        );
      } else {
        orchid.isFavorite = true;
        favoritesArray.push(orchid);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));

      const updatedOrchids = orchids.map((orchids) => ({
        ...orchids,
        data: orchids.data.map((item) => ({
          ...item,
          isFavorite: item.name === orchid.name ? !isFavorite : item.isFavorite,
        })),
      }));

      setOrchids(updatedOrchids);
    } catch (error) {
      console.error("Error saving favorite orchid:", error);
    }
  };

  useEffect(() => {
    fetchDataOrchids();
  }, []);

  useEffect(() => {
    const unsubscribe = navigate.addListener("focus", () => {
      fetchDataOrchids();
    });
    fetchDataOrchids();
    return unsubscribe;
  }, [navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDataOrchids();
    setRefreshing(false);
  };
  const renderOrchids = ({ item }) => (
    <View style={styles.orchidInfo}>
      <View style={styles.titleAndLove}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
            color: "#BB8FCE",
            marginBottom: 6,
            marginLeft:10
          }}
          onPress={() => navigate.navigate("detail", { item })}
        >
         {item.name}
        </Text>
        <TouchableOpacity onPress={() => saveFavoriteOrchid(item)}>
          <MaterialIcons
            name={item.isFavorite ? "favorite" : "favorite-border"}
            size={24}
            color="red"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigate.navigate("detail", { item })}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            alt={item.name}
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
      <Text style={{ color: "#2ECC71", marginLeft: 16 }}>
        Status: {item.isTopOfTheWeek ? "Top of the Week" : "Regular"}
      </Text>
    </View>
  );
  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, textAlign: "center", margin: 10 }}>
        Orchid List
      </Text>
      <SectionList
        sections={orchids}
        renderItem={renderOrchids}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.name}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 18,
  },
  orchidInfo: {
    width: "90%",
    marginTop: 40,
    marginLeft: 18,
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "white",
    backgroundColor:'white',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 14},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sectionHeader: {
    width: "60%",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#16A085",
    textAlign: "left",
    color: "white",
    padding: 10,
    marginTop: 20,
    
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 320,
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius: 12,
  },

  titleAndLove: {
    flexDirection:'row',
    justifyContent:'space-between'
  }
});
