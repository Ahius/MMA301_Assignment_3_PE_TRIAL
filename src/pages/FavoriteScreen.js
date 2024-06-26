import {
  Image,
  SectionList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FavoriteScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigation();


    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          const validFavorites = parsedFavorites.filter(fav => fav && fav.name);
          setFavorites(validFavorites);

        }
      } catch (error) {
        console.error("Error loading favorites: ", error);
      }
    };

 

  useEffect(() => {
    const unsubscribe = navigate.addListener("focus", () => {
      loadFavorites();
    });
    // Call favoritesData initially to load data when component mounts
    loadFavorites();
    // Cleanup the event listener on component unmount
    return unsubscribe;
  }, [navigate]);

  

  const handleRefresh = async () => {
    setRefreshing(true);
    // const storedFavorites = await AsyncStorage.getItem('favorites');
    // setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    loadFavorites();
    setRefreshing(false);
  };

  const clearFavorites = async () => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to remove all orchid from favorite list?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("favorites");
              setFavorites([]);
            } catch (error) {
              console.error("Error clearing favorites: ", error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
   
  };

  const removeFavorite = async (item) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to remove ${item.name} from favorites?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(fav => fav && fav.name !== item.name);
              await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
              setFavorites(updatedFavorites);
            } catch (error) {
              console.error("Error removing favorite: ", error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderFavorite = ({ item }) => (
    <View style={styles.orchidInfo}>
      <TouchableOpacity onPress={() => navigate.navigate("detail", { item })}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            alt={item.name}
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
      <View>
        <Text
          style={styles.orchidName}
          onPress={() => navigate.navigate("detail", { item })}
        >
          {item.name}
        </Text>
        <TouchableOpacity style={{margin:10}} onPress={() => removeFavorite(item)}>
          <MaterialCommunityIcons name="book-remove-multiple-outline" size={24} color="#F1C40F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Orchids</Text>
      <TouchableOpacity style={styles.clearButton} onPress={clearFavorites}>
        <Text style={styles.clearButtonText}>Clear Favorites</Text>
      </TouchableOpacity>

      {favorites.length > 0 ? (
        <SectionList
          sections={[{ title: "Favorites", data: favorites }]}
          renderItem={renderFavorite}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.name}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <Text style={styles.noFavorites}>No favorite orchids yet.</Text>
      )}
    </View>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
  },
  orchidInfo: {
    flexDirection: "row",
    width: "90%",
    marginTop: 20,
    marginLeft: 18,
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
  },
  orchidName: {
    fontSize: 15,
    justifyContent: "center",
    margin: 10,
    color: "#A569BD",
    marginBottom: 6,
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 90,
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius: 12,
  },
  orchidStatus: {
    color: "#2ECC71",
    marginLeft: 16,
  },
  noFavorites: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#95a5a6",
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
});
