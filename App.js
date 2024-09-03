import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc ,getDocs,doc, updateDoc,arrayUnion} from 'firebase/firestore';
import { Rating } from 'react-native-ratings'; // Make sure to install this package if you haven't
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const firebaseConfig = {
  apiKey: "AIzaSyDTOq4NBxYazZ5yMYRxKLedfN7zUTVPbcs",
  authDomain: "kiwisuit-a01b0.firebaseapp.com",
  databaseURL: "https://kiwisuit-a01b0-default-rtdb.firebaseio.com",
  projectId: "kiwisuit-a01b0",
  storageBucket: "kiwisuit-a01b0.appspot.com",
  messagingSenderId: "397470845673",
  appId: "1:397470845673:web:e173a0c7158539c9abbe78",
  measurementId: "G-QVX1EF4DN3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Hotels = [
  // Sample hotel data
  { id: '1', name: 'Hotel Paradise', location: 'Colombo', image: 'https://example.com/image1.jpg', description: 'Beautiful hotel in Colombo', reviews: ['hello'], username: 'user1' },
  { id: '2', name: 'Beach Resort', location: 'Galle', image: 'https://example.com/image2.jpg', description: 'Beachside resort in Galle', reviews: [], username: 'user2' },
  // More hotels...
];
const users =[{id:'1',firstname:'chamindu',lastname:'moramudali',username: 'user1' ,password:'user1'}];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHotels, setFilteredHotels] = useState();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [showHotelRegisterForm, setShowHotelRegisterForm] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [registeredHotels, setRegisteredHotels] = useState();
  const [allHotels, setallHotels] = useState();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [offers, setOffers] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [offer, setOffer] = useState('');
  const [description, setDescription] = useState('');
  const [reply, setReply] = useState('');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0); // Rating out of 5
  const [Author , setAuthor]= useState('');
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
    // Fetch hotels from Firestore
    const fetchHotels = async () => {
      try {

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRegisteredHotels(usersList);


        const querySnapshot = await getDocs(collection(db, 'hotels'));
        const hotelsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setallHotels(hotelsList);
        setFilteredHotels(hotelsList);
      } catch (error) {
        console.error("Error fetching hotels: ", error);
        Alert.alert('Error', 'Something went wrong while fetching the hotels');
      }
    };
    fetchHotels();
  }, []);


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

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setImage(selectedImage);
      }
    });
  };

  const RegisterNewHotel = async () => {
    console.log("Document written with ID: ");

    if (!name || !location || !image || !description || !username) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    const newHotel = {
      name,
      location,
      image,
      description,
      reviews: [],
      offers:[], 
      username,
    };
  
    try {

      const storage = getStorage();
    const imageRef = ref(storage, `hotels/${Date.now()}_${name}`);

    // Convert the image URI to a blob for upload
    const response = await fetch(image);
    const blob = await response.blob();

    // Upload the image to Firebase Storage
    await uploadBytes(imageRef, blob);

    // Get the image URL from Firebase Storage
    const imageUrl = await getDownloadURL(imageRef);
    newHotel.image = imageUrl; // Update the image URL in the hotel data


      // Save the hotel data to Firestore
      const docRef = await addDoc(collection(db, 'hotels'), newHotel);
      console.log("Document written with ID: ", docRef.id);

      // You can add the generated ID to the hotel object if needed
      newHotel.id = docRef.id;
  
      // Update the local state
      setallHotels([...allHotels, newHotel]);
      Alert.alert('Success', 'Hotel registered successfully');
      
      // Clear form fields
      setName('');
      setLocation('');
      setImage('');
      setDescription('');
      setUsername('');
      setShowRegisterForm(false);
  
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'Something went wrong while registering the hotel');
    }
  };
  
  const handleRegisterHotel  = async () => {
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
    const docRef = await addDoc(collection(db, 'users'), newHotel);

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
    fetchHotels();

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
    // Create a new array to store the offers for the selected hotel
    const newOffers = hotel.offers ? [...hotel.offers] : [];
  
    // Set the new offers array in the state
    setOffers(newOffers);
  
    // Log to verify
    console.log("New offers array:", newOffers);
  console.log(offers)
    // Continue with other state updates
    setSelectedHotel(hotel);
    setSelectedTab(0);
    setEditingDescription(false);
    setAddingOffer(false);
    setReplyingToReview(null);
  };
  
  
  const handleBack = () => {
    setSelectedHotel(null);
    setEditingHotel(false);

  };

  
  const toggleRegisterForm = () => {

    setShowHotelRegisterForm(!showHotelRegisterForm);


  };
  const handleSaveDescription = async () => {
    if (description.trim()) {
      const updatedHotel = { ...selectedHotel, description };
  console.log(updatedHotel)
      try {
        // Update the hotel description in Firestore
        const hotelDocRef = doc(db, 'hotels', selectedHotel.id); // Replace 'hotels' with your collection name
        await updateDoc(hotelDocRef, { description });
  
        // Update local state
        setallHotels(prevHotels => prevHotels.map(hotel => 
          hotel.id === selectedHotel.id ? updatedHotel : hotel
        ));
        setSelectedHotel(updatedHotel);
        Alert.alert('Success', 'Description updated successfully');
        setEditingDescription(false);
        fetchHotels();

      } catch (error) {
        Alert.alert('Error', 'Failed to update description. Please try again.');
        console.error("Error updating description: ", error);
      }
    } else {
      Alert.alert('Error', 'Description cannot be empty');
    }
  };

  const handleSaveHotelDetails = async () => {
    if (!name || !location || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedHotel = {
      name,
      location,
      image: image || selectedHotel.image, // Keep the current image if not changed
      description,
      username: selectedHotel.username,
    };

    try {
      const hotelDocRef = doc(db, 'hotels', selectedHotel.id);

      if (image && image !== selectedHotel.image) {
        const storage = getStorage();
        const imageRef = ref(storage, `hotels/${Date.now()}_${name}`);

        const response = await fetch(image);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);

        const imageUrl = await getDownloadURL(imageRef);
        updatedHotel.image = imageUrl;
      }

      await updateDoc(hotelDocRef, updatedHotel);

      setallHotels(prevHotels => prevHotels.map(hotel =>
        hotel.id === selectedHotel.id ? updatedHotel : hotel
      ));

      setSelectedHotel(updatedHotel);
      Alert.alert('Success', 'Hotel details updated successfully');
      setEditingDescription(false);

    } catch (error) {
      
      Alert.alert('Error', 'Something went wrong while updating the hotel details');
    }
  };


  const handleAddReview = async () => {
    if (!newReview || rating === 0) {
      Alert.alert('Error', 'Please enter a review and select a rating');
      return;
    }
  
    const newReviewObj = {
      username: Author,
      review: newReview,
      rating: rating, // Include rating
    };
  
    try {
      const hotelDocRef = doc(db, 'hotels', selectedHotel.id);
  
      await updateDoc(hotelDocRef, {
        reviews: arrayUnion(newReviewObj),
      });
  
      const updatedHotel = { 
        ...selectedHotel,
        reviews: [...selectedHotel.reviews, newReviewObj],
      };
      setSelectedHotel(updatedHotel);
  
      Alert.alert('Success', 'Review added successfully');
      setNewReview('');
      setRating(0); // Reset rating after submission
      setAuthor('');
    } catch (error) {
      console.error('Error adding review: ', error);
      Alert.alert('Error', 'Something went wrong while adding the review');
    }
  };
  
  const handleAddOffer = async () => {
    if (offer.trim()) {
      try {
        const hotelDocRef = doc(db, 'hotels', selectedHotel.id);
        
        // Add new offer to the Firestore database
        await updateDoc(hotelDocRef, {
          offers: arrayUnion(offer)
        });
  
        // Update local state
        setOffers(prevOffers => {
          const updatedOffers = [...prevOffers, offer];
          console.log('Offers:', updatedOffers); // Log the updated offers here
          return updatedOffers;
        });

        const updatedHotel = { 
          ...selectedHotel,
          offers: [...selectedHotel.offers, offer],
        };

        setSelectedHotel(updatedHotel);

        Alert.alert('Success', 'Offer added successfully');
        setOffer(''); // Clear the input field
        setAddingOffer(false);
      } catch (error) {
        console.error("Error adding offer: ", error);
        Alert.alert('Error', 'Failed to add offer');
      }
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
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewText}>{item.review}</Text>
      <Rating
        imageSize={20}
        readonly
        startingValue={item.rating}
        style={styles.rating}
      />
      <Text style={styles.username}>{item.username}</Text>
    </View>
  );
  
  const RatingInput = ({ rating, setRating }) => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={24}
            color={star <= rating ? "#FFD700" : "#ccc"}
          />
        </TouchableOpacity>
      ))}
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
      <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

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
          {selectedTab === 0 &&(
            <View>
            <Text style={styles.sectionTitle}>Offers</Text>
            {offers.length ? (
               <FlatList
               data={selectedHotel.offers}
               keyExtractor={(item, index) => index.toString()}
               renderItem={({ item }) => (
                 <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                   <Text>{item}</Text>
                 </View>
               )}
             />
            ) : (
              <Text>No offers available</Text>
            )}
          </View>
          )}
          {loggedInUser && selectedTab === 0 && (
            <View>
              {editingDescription ? (
               <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Edit Hotel Details</Text>
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
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Text style={styles.buttonText}>Upload New Image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => setEditingDescription(false)}>
            <Text style={styles.editButton}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSaveHotelDetails}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
         
        </View>
              ) : (
                <TouchableOpacity onPress={() => setEditingDescription(true)}>
                  <Text style={styles.editButton}>Edit Hotel</Text>
                </TouchableOpacity>
                
              )}
           

          {/* Add Offer Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add an offer"
              value={offer}
              onChangeText={setOffer}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddOffer}>
              <Text style={styles.buttonText}>Add Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
          {selectedTab === 1 && (
             <ScrollView>
             <FlatList
               data={selectedHotel.reviews}
               renderItem={renderReviewItem}
               keyExtractor={(item, index) => index.toString()}
             />
             <View style={styles.formContainer}>
               <TextInput
                 style={styles.input}
                 placeholder="Add a review"
                 value={newReview}
                 onChangeText={setNewReview}
               />
               <TextInput
                 style={styles.input}
                 placeholder="Add Name"
                 value={Author}
                 onChangeText={setAuthor}
               />
               <RatingInput rating={rating} setRating={setRating} />
               <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
                 <Text style={styles.buttonText}>Add Review</Text>
               </TouchableOpacity>
             </View>
           </ScrollView>
          )}
        </View>

          
        </ScrollView>
      ) : showRegisterForm ? (
        <View style={styles.formContainer}>
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
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
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

  reviewText: {
    fontSize: 16,
  },

  reviewItem: {
    backgroundColor: '#444', // Dark background for review items
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewText: {
    color: '#fff',
    fontSize: 16,
  },
  username: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 5,
  },
  rating: {
    color: '#ffd700', // Gold color for rating
    fontSize: 14,
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#f5f5f5', // Dark background for the form
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  input: {
    backgroundColor: '#555', // Slightly lighter dark color for input
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007bff', // Button color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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

  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  reviewContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  rating: {
    marginVertical: 5,
  },
  username: {
    fontSize: 14,
    color: '#555',
  },
  starButton: {
    marginHorizontal: 2,
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
