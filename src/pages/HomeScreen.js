import { Image, SectionList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HomeScreen = () => {
  const [orchids, setOrchids] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  

  const fetchDataOrchids = async () => {
    // setRefreshing(true);
    try {
      const response = await axios.get("https://667a6d77bd627f0dcc8ee044.mockapi.io/api/v1/categories");
      console.log("Response data:", response.data);
      const formattedData = response.data.map((category) => ({
        title: category.name,
        data: Array.isArray(category.items) ? category.items : [],
      }));
      setOrchids(formattedData);
    } catch (error) {
      console.error("Error to fetch data: ", error);
      setOrchids([]);
    } finally {
      // setRefreshing(false);
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
      <Text>Name of orchid: {item.name}</Text>
      <Image
        source={{ uri: item.image }}
        alt={item.name}
        style={styles.image}
      />
      <Text>Status: {item.isTopOfTheWeek ? "Top of the Week" : "Regular"}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={{fontSize:30, textAlign:'center', margin:10}}>Orchid List</Text>
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
  },
  orchidInfo: {
    width: "90%",
    marginTop: 40,
    marginLeft: 18,
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 12,
    padding: 10,
  },
  sectionHeader: {
    width:'60%',
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#16A085",
    textAlign:'left',
    color: "white",
    padding: 10,
    marginTop: 20,
    borderBottomRightRadius:12,
    borderTopRightRadius:12,
  },
  image: {
    width: 330,
    height: 200,
    resizeMode: "cover",
    marginVertical: 10,
  },
});
