import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SegmentedControlTab from 'react-native-segmented-control-tab';

const Hotels = [
  // Sample hotel data
  { id: '1', name: 'Hotel Paradise', location: 'Colombo', image: 'https://example.com/image1.jpg', description: 'Beautiful hotel in Colombo', reviews: ['hello'], username: 'user1' },
  { id: '2', name: 'Beach Resort', location: 'Galle', image: 'https://example.com/image2.jpg', description: 'Beachside resort in Galle', reviews: [], username: 'user2' },
  // More hotels...
];
const users =[{id:'1',firstname:'chamindu',lastname:'moramudali',username: 'user1' ,password:'user1'}];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHotels, setFilteredHotels] = useState(Hotels);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [showHotelRegisterForm, setShowHotelRegisterForm] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [registeredHotels, setRegisteredHotels] = useState(users);
  const [allHotels, setallHotels] = useState(Hotels);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [offer, setOffer] = useState('');
  const [description, setDescription] = useState('');
  const [reply, setReply] = useState('');
  const [newReview, setNewReview] = useState('');

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [addingOffer, setAddingOffer] = useState(false);
  const [replyingToReview, setReplyingToReview] = useState(null);
  const [newHotel, setNewHotel] = useState({
    id: '',
    name: '',
    location: '',
    image: '',
    description: '',
    username: ''
  });

  useEffect(() => {
    if (loggedInUser) {
      // Filter hotels based on the logged-in user
      const userHotels = allHotels.filter(hotel => hotel.username === loggedInUser);
      setFilteredHotels(userHotels);
    }
  }, [loggedInUser]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredData = filteredHotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(text.toLowerCase()) ||
      hotel.location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredHotels(filteredData);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    if (loggedInUser) {
      // Refresh filtered hotels based on the logged-in user
      const userHotels = allHotels.filter(hotel => hotel.username === loggedInUser);
      setFilteredHotels(userHotels);
    }
  };

  const toggleLoginView = () => {
    if (loggedInUser) {
      handleLogout();
    } else {
      setShowLogin(!showLogin);
      setShowRegisterForm(false);
      setShowProfile(false);
    }
  };

  const handleRegister = () => {
    setShowRegisterForm(true);
    setShowLogin(false);
    setShowProfile(false);
  };

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter your username and password');
      return;
    }

    // Example login logic
    const isValidUser = registeredHotels.some(user => user.username === username && user.password === password);

    if (isValidUser) {
      Alert.alert('Success', 'Logged in successfully');
      setLoggedInUser(username);
      setShowLogin(false);
      setShowProfile(true);
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }

    setUsername('');
    setPassword('');
  };
  const RegisterNewHotel = () => {
    if (!name || !location || !image || !description || !username) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newHotel = {
      id: (allHotels.length + 1).toString(), // Generate a new ID based on the array length
      name,
      location,
      image,
      description,
      reviews: [],
      username,
    };

    setallHotels([...allHotels, newHotel]);

    Alert.alert('Success', 'Hotel registered successfully');

    // Clear form fields
    setName('');
    setLocation('');
    setImage('');
    setDescription('');
    setUsername('');
    setShowRegisterForm(false);
  };
  const handleRegisterHotel = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    const newHotel = {
      firstname,
      lastname,
      username,
      password,
    };
  
    // Add the new hotel to the registeredHotels array
    setRegisteredHotels((prevHotels) => [...prevHotels, newHotel]);
  
    console.log('Registered Hotel:', newHotel);
  
    Alert.alert('Success', 'Hotel registered successfully');
  
    // Clear the input fields
    setFirstname('');
    setLastname('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowRegisterForm(false);
  };
  

  const handleLogout = () => {
    setLoggedInUser(null);
    setFilteredHotels(allHotels);
    setShowLogin(false);
    setShowRegisterForm(false);
    setShowProfile(false);
    setSelectedHotel(null);
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setSelectedTab(0);
    setEditingDescription(false);
    setAddingOffer(false);
    setReplyingToReview(null);
  };

  const handleBack = () => {
    setSelectedHotel(null);
  };

  
  const toggleRegisterForm = () => {

    setShowHotelRegisterForm(!showHotelRegisterForm);


  };
  const handleSaveDescription = () => {
    if (description.trim()) {
      const updatedHotel = { ...selectedHotel, description };
      setallHotels(prevHotels => prevHotels.map(hotel => 
        hotel.id === selectedHotel.id ? updatedHotel : hotel
      ));
      setSelectedHotel(updatedHotel);
      Alert.alert('Success', 'Description updated successfully');
      setEditingDescription(false);
    } else {
      Alert.alert('Error', 'Description cannot be empty');
    }
  };
  
  const handleAddReview = () => {
    if (newReview.trim()) {
      const updatedHotel = { ...selectedHotel, reviews: [...selectedHotel.reviews, newReview] };
      setallHotels(prevHotels => prevHotels.map(hotel => 
        hotel.id === selectedHotel.id ? updatedHotel : hotel
      ));
      setSelectedHotel(updatedHotel);
      setNewReview('');
    } else {
      Alert.alert('Error', 'Review cannot be empty');
    }
  };
  

  const handleAddOffer = () => {
    if (offer.trim()) {
      Alert.alert('Success', 'Offer added successfully');
      setAddingOffer(false);
    } else {
      Alert.alert('Error', 'Offer cannot be empty');
    }
  };

  const handleReplyToReview = () => {
    if (reply.trim()) {
      Alert.alert('Success', 'Reply sent successfully');
      setReplyingToReview(null);
    } else {
      Alert.alert('Error', 'Reply cannot be empty');
    }
  };

 
  
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewText}>
      <Text style={styles.reviewText}>{item}</Text>
    </View>
  );


  const renderHotel = ({ item }) => (
    <TouchableOpacity style={styles.hotelTile} onPress={() => handleHotelSelect(item)}>
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <Text style={styles.hotelName}>{item.name}</Text>
      <Text style={styles.hotelLocation}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Visit Sri Lanka</Text>
        
        {loggedInUser && (
          <View>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleLoginView}>
          <Text style={styles.buttonText}>{showLogin || showRegisterForm ? 'Show Hotels' : loggedInUser ? 'Logout' : 'Login / Register'}</Text>

        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleRegisterForm}>
        <Text style={styles.buttonText}>Add New Hotel</Text>

        </TouchableOpacity>
          </View>
        )}
      </View>


      {!selectedHotel && !showProfile && (
        <TouchableOpacity style={styles.toggleButton} onPress={toggleLoginView}>
          <Text style={styles.buttonText}>{showLogin || showRegisterForm ? 'Back' : loggedInUser ? 'Logout' : 'Login / Register'}</Text>

        </TouchableOpacity>
      )}

      
      
{showHotelRegisterForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Register New Hotel</Text>
          <TextInput
            placeholder="Hotel Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
          <TextInput
            placeholder="Image URL"
            value={image}
            onChangeText={setImage}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TouchableOpacity style={styles.submitButton} onPress={RegisterNewHotel}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      ):(selectedHotel ? (
        <ScrollView contentContainerStyle={styles.detailContainer}>
          <View style={styles.hotelDetails}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.hotelName}>{selectedHotel.name}</Text>
          <Image source={{ uri: selectedHotel.image }} style={styles.hotelImage} />
          <Text style={styles.hotelLocation}>{selectedHotel.location}</Text>
          <Text style={styles.hotelDescription}>{selectedHotel.description}</Text>
          <SegmentedControlTab
            values={['Details', 'Reviews']}
            selectedIndex={selectedTab}
            onTabPress={(index) => setSelectedTab(index)}
          /> 
          {loggedInUser && selectedTab === 0 && (
            <View>
              {editingDescription ? (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Edit Description"
                    value={description}
                    onChangeText={setDescription}
                  />
                  <TouchableOpacity style={styles.submitButton} onPress={handleSaveDescription}>
                    <Text style={styles.buttonText}>Save Description</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditingDescription(true)}>
                  <Text style={styles.editButton}>Edit Description</Text>
                </TouchableOpacity>
              )}
              
            </View>
          )}
          {selectedTab === 1 && (
            <ScrollView>
          
              <View>
                <FlatList
              data={selectedHotel.reviews}
              renderItem={renderReviewItem}
              keyExtractor={(item, index) => index.toString()}
            />
                <TextInput
                  style={styles.input}
                  placeholder="Add a review"
                  value={newReview}
                  onChangeText={setNewReview}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
                  <Text style={styles.buttonText}>Add Review</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>

          
        </ScrollView>
      ) : showRegisterForm ? (
        <View style={styles.registerContainer}>
          <Text style={styles.registerHeader}>Register Hotel</Text>
          <TextInput
            style={styles.inputField}
            placeholder="First Name"
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Last Name"
            value={lastname}
            onChangeText={setLastname}
          />
      
          <TextInput
            style={styles.inputField}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegisterHotel}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
         
        </View>
      ) : showLogin ? (
        <View style={styles.loginContainer}>
          <Text style={styles.loginHeader}>Login</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search hotels"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <Ionicons name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredHotels}
            renderItem={renderHotel}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.hotelList}
          />
        </>
      ))}

      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loggedInUserText: {
    fontSize: 16,
    marginTop: 10,
  },
  toggleButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  hotelTile: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  hotelImage: {
    width: '100%',
    height: 150,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  hotelLocation: {
    fontSize: 14,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  detailContainer: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 20,
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  detailLocation: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  segmentedControl: {
    marginVertical: 10,
  },
  segmentedControlTab: {
    borderColor: '#007BFF',
  },
  segmentedControlActiveTab: {
    backgroundColor: '#007BFF',
  },
  segmentedControlText: {
    color: '#007BFF',
  },
  segmentedControlActiveText: {
    color: 'white',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  editDescriptionContainer: {
    marginBottom: 20,
  },
  addOfferContainer: {
    marginTop: 20,
  },
  reviewContainer: {
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 5,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  addReviewContainer: {
    marginTop: 20,
  },
  inputField: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  hotelList: {
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  refreshButton: {
    padding: 10,
  },
  loginContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  loginHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  registerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  registerHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  hotelTile: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  hotelImage: {
    width: '100%',
    height: 150,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  hotelLocation: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 10,
  },
  formContainer: {
    marginTop: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
  hotelDetails: {
    flex: 1,
  },
  backButton: {
    marginBottom: 10,
  },
  hotelDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewContainer: {
    marginBottom: 10,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  reviewText: {
    fontSize: 16,
  },
  replyText: {
    fontSize: 14,
    color: '#555',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    color: '#007bff',
    marginTop: 10,
  },
  toggleButton: {
    marginVertical: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loggedInUserText: {
    marginTop: 10,
    fontSize: 16,
  },
});
