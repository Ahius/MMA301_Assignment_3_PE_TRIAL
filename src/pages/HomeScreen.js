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
import { MaterialIcons } from '@expo/vector-icons';
const HomeScreen = () => {
  const [orchids, setOrchids] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigation();
  const fetchDataOrchids = async () => {
    try {
      const response = await axios.get(
        "https://667a6d77bd627f0dcc8ee044.mockapi.io/api/v1/categories"
      );
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      const formattedData = response.data.map((category) => ({
        title: category.name,
        data: Array.isArray(category.items) ? category.items.map((item) => ({
          ...item,
          isFavorite: favoritesArray.some(fav => fav && fav.name === item.name),
        })) : [],
      }));
      setOrchids(formattedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setOrchids([]);
    }
  };
  const saveFavoriteOrchid = async (orchid) => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = favorites ? JSON.parse(favorites) : [];
      
      // Check if orchid is defined and has a name property
      let isFavorite = orchid && orchid.name ? favoritesArray.some(fav => fav && fav.name === orchid.name) : false;
      
      if (isFavorite) {
        favoritesArray = favoritesArray.filter(fav => fav.name !== orchid.name);
      } else {
        favoritesArray.push(orchid);
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      
      // Update orchids state to reflect changes
      const updatedOrchids = orchids.map(section => ({
        ...section,
        data: section.data.map(item => ({
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
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDataOrchids();
    setRefreshing(false);
  };
  const renderOrchids = ({ item }) => (
    <View style={styles.orchidInfo}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          textAlign: "center",
          color: "#BB8FCE",
          marginBottom: 6,
        }}
        onPress={() => navigate.navigate("detail", { item })}
      >
        Name of orchid: {item.name}
      </Text>
      <TouchableOpacity onPress={() => navigate.navigate("detail", { item })}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            alt={item.name}
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
      <Text style={{ color: "#2ECC71", marginLeft:16 }}>
        Status: {item.isTopOfTheWeek ? "Top of the Week" : "Regular"}
      </Text>
      <TouchableOpacity onPress={() => saveFavoriteOrchid(item)}>
      <MaterialIcons
        name={item.isFavorite ? "favorite" : "favorite-border"}
        size={24}
        color="red"
      />
    </TouchableOpacity>
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
    marginBottom:18
  },
  orchidInfo: {
    width: "90%",
    marginTop: 40,
    marginLeft: 18,
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#34495E",
    borderRadius: 12,
    padding: 10,
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
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
  },
  imageContainer: {
    display:'flex',
    alignItems:'center'
  },
  image: {
    width: 300,
    height: 320,
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius:12
  },
});