import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TextInput, Dimensions } from 'react-native';

// Sample data for hotels with location information
const hotels = [
  {
    id: '1',
    name: 'Hotel California',
    image: 'https://example.com/hotel1.jpg', // Replace with actual image URL
    location: 'Los Angeles, CA',
  },
  {
    id: '2',
    name: 'The Grand Budapest',
    image: 'https://example.com/hotel2.jpg', // Replace with actual image URL
    location: 'Budapest, Hungary',
  },
  {
    id: '3',
    name: 'Sunset Paradise',
    image: 'https://example.com/hotel3.jpg', // Replace with actual image URL
    location: 'Miami, FL',
  },
  // Add more hotel objects as needed
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHotels, setFilteredHotels] = useState(hotels);

  // Function to handle the search logic
  const handleSearch = (text) => {
    setSearchQuery(text);

    // Filter hotels based on search query (case-insensitive)
    const filteredData = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(text.toLowerCase()) ||
      hotel.location.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredHotels(filteredData);
  };

  // Render function for each item in the FlatList
  const renderHotel = ({ item }) => (
    <View style={styles.hotelTile}>
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <Text style={styles.hotelName}>{item.name}</Text>
      <Text style={styles.hotelLocation}>{item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Visit Sri</Text>
      
      {/* Search bar input */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by hotel name or location"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredHotels}
        renderItem={renderHotel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  hotelTile: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // For Android shadow
    width: Dimensions.get('window').width - 20, // Full width minus padding
    alignSelf: 'center', // Centering the tile in the container
  },
  hotelImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
