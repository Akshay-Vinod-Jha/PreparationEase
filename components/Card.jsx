import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({ imageSource, featureName, description }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.featureName}>{featureName}</Text>
      <Text style={styles.description}>{description}</Text>
     {/* <View style={styles.arrowButton} />*/}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '45%', // Adjusted for a wider card
    height: 170, // Adjusted for taller cards to accommodate image and text
    backgroundColor: '#D1C4E9',
    borderRadius: 15,
    marginBottom: 10,
    elevation: 5, // Adjusted shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    padding: 10,  //Added padding to create space around content
    justifyContent: 'space-between', // Vertically distribute content
  },
  image: {
    width: '100%', //Adjusted to fill width
    height: 80,
    resizeMode: 'contain', //Prevents image from stretching
    marginBottom: 5,  // Added spacing between image and feature name
  },
  featureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 3, // Added spacing between feature name and description
  },
  description: {
    fontSize: 12,
    color: '#4A148C',
  },
  arrowButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slightly transparent black for the arrow background
    alignSelf: 'flex-end', // Aligns the arrow button to the right
  },
});

export default Card;