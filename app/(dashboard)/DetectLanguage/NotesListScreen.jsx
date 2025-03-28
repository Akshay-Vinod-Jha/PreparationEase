// NotesListScreen.jsx
import React from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'react-native';
import Note from '../../../components/Note'; // Import the Note component

const NotesListScreen = () => {
  const notes = [
    { 
      id: '1', 
      header: 'React Basics', 
      description: 'React is a JavaScript library used for building user interfaces, especially single-page applications. It follows a component-based architecture, where UI elements are reusable and managed efficiently. React uses a virtual DOM to optimize rendering and improve performance. JSX, a syntax extension, allows developers to write HTML-like code within JavaScript. React also provides state management features, enabling dynamic and interactive web applications.' 
    },
    { 
      id: '2', 
      header: 'React Advanced', 
      description: 'React advanced concepts...' 
    },
    // Add more demo notes here.
  ];

  const renderNote = ({ item }) => (
    <Note header={item.header} description={item.description} />
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E6E0FF" barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Detect Language</Text>
        <View style={styles.profileIcon} /> {/* Placeholder for profile icon */}
      </View>

      <View style={styles.searchBarContainer}>
        <Image
         // source={require('../../assets/images/adaptive-icon.png')} // Replace with your search icon
          style={styles.searchIcon}
        />
        <TextInput style={styles.searchBar} placeholder="Search Note" placeholderTextColor="#A9A9A9" />
      </View>
      
      <FlatList 
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E0FF', // Light purple background
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C', // Dark purple color
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1C4E9', // light purple
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1C4E9',
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#A9A9A9',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#D1C4E9',
    paddingVertical: 10,
    borderRadius: 10,
    color: '#000',
  },
  flatListContent: {
    paddingHorizontal: 20,
  },
});

export default NotesListScreen;
