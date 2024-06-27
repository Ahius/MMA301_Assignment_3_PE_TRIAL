import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrchidDetailScreen = () => {
  const route = useRoute();
  const { item: initialItem } = route.params;
  const [item, setItem] = useState(initialItem);
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);
  const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   setIsFavorite(item.isFavorite);
  // }, [item.isFavorite]);
  


  const fetchUpdatedItem = async () => {

    const updatedItem = {
      ...initialItem,
      isFavorite: !initialItem.isFavorite 
    };
    return updatedItem;
  };

  console.log("ITEM: ", item);


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUpdatedItem();
    setRefreshing(false);
  };




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
      item.isFavorite = !isFavorite;

    } catch (error) {
      console.error("Error saving favorite orchid:", error);
    }
  };

  return (
    <ScrollView
    contentContainerStyle={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }
  >
    <View style={styles.container}>
      <View style={styles.body}>
        <Image
          source={{ uri: item.image }}
          alt={item.name}
          style={styles.image}
        />
        <Text style={{ fontSize: 26, textAlign: "center", color: "#E74C3C" }}>
          {item.name}
        </Text>
        <TouchableOpacity onPress={() => saveFavoriteOrchid(item)}>
          <MaterialIcons
            name={item.isFavorite ? "favorite" : "favorite-border"}
            size={24}
            color="red"
          />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <View style={styles.infoLeft}>
            <Text style={styles.textInfo}>Origin: {item.origin}</Text>
            <Text style={styles.textInfo}>Price: {item.price}$</Text>
            <Text style={styles.textInfo}>Weight: {item.weight}</Text>
          </View>
          <View style={styles.infoRight}>
            <Text
              style={{ fontSize: 15, color: "#D35400", fontStyle: "italic" }}
            >
              Rating: {item.rating}{" "}
              <AntDesign name="star" size={17} color="#D35400" />
            </Text>
          </View>
        </View>
        <View style={{marginTop:20, marginLeft:7}}>
          <Text style={{fontSize:16}}>Description: </Text>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};

export default OrchidDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 26,
  },
  image: {
    width: 350,
    height: 300,
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    borderColor: "#2E86C1",
  },

  infoLeft: {
    marginLeft: 20,
    gap: 16,
  },

  textInfo: {
    fontSize: 17,
    color: "#3498DB",
  },

  infoRight: {
    marginRight: 20,
  },
});
