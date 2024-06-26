import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
const OrchidDetailScreen = () => {
  const route = useRoute();
  const { item } = route.params;

  return (
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
