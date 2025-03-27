import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Card from '../../components/Card';

import { StatusBar } from 'react-native';


const MainDashboard = () => {

// Example image URLs (replace with your actual URLs)
  const detectLanguageImage = require('../../assets/images/Logo.png'); // Replace with your actual path
  const summarizeText = require('../../assets/images/Logo.png');       // Replace with your actual path
  const optimizeNotes = require('../../assets/images/Logo.png');      // Replace with your actual path

  return (
    <View style={styles.container}>
            <StatusBar backgroundColor="#E6E0FF" barStyle="dark-content" />

      {/* Header Section (Same as before) */}
      <View style={styles.header}>
        <Text style={styles.prepEaseText}>PREPEASE</Text>
        <View style={styles.profileIcon} /> {/* Placeholder for profile icon */}
      </View>

      {/* Welcome Section (Same as before) */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.nameText}>AtharvaKanthak!</Text>
        <Text style={styles.descriptionText}>
          Your Smart Study Companion! Analyze, Summarize & Optimize Notes Effortlessly
        </Text>
        <TouchableOpacity style={styles.getStartedButton}>
          <Text style={styles.getStartedText}>Get Started with PrepEase</Text>
        </TouchableOpacity>
      </View>

      {/* Explore Features Section */}
      <View style={styles.exploreSection}>
        <Text style={styles.exploreText}>Explore Our Powerful Features</Text>
      </View>

      {/* Scrollable Cards Section */}
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {/* Card 1 */}
        <Card
          imageSource={detectLanguageImage}
          featureName="Detect Language"
          description="Identify the language used in uploaded notes."
        />

        {/* Card 2 */}
        <Card
          imageSource={summarizeText}
          featureName="Summarize Text"
          description="Get a concise summary of your study materials."
        />

        {/* Card 3 */}
        <Card
          imageSource={optimizeNotes}
          featureName="Optimize Notes"
          description="Improve the quality of your notes."
        />

        {/* Card 4 */}
         <Card
          imageSource={detectLanguageImage}
          featureName="Detect Language"
          description="Identify the language used in uploaded notes."
        />

        {/* Card 5 */}
        <Card
          imageSource={summarizeText}
          featureName="Summarize Text"
          description="Get a concise summary of your study materials."
        />

        {/* Card 6 */}
        <Card
          imageSource={optimizeNotes}
          featureName="Optimize Notes"
          description="Improve the quality of your notes."
        />

        {/* Card 7 */}
         <Card
          imageSource={detectLanguageImage}
          featureName="Detect Language"
          description="Identify the language used in uploaded notes."
        />

        {/* Card 8 */}
        <Card
          imageSource={summarizeText}
          featureName="Summarize Text"
          description="Get a concise summary of your study materials."
        />

        {/* Card 9 */}
        <Card
          imageSource={optimizeNotes}
          featureName="Optimize Notes"
          description="Improve the quality of your notes."
        />
      </ScrollView>

       {/* Bottom Navigation (Placeholder) */}
       <View style={styles.bottomNav}>
          <View style={styles.homeIcon} /> {/* Placeholder for home icon */}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E0FF',  // Background color from image
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  prepEaseText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',  // Dark purple color
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1C4E9', // light purple
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4A148C',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#7B1FA2', // Dark purple
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exploreSection: {
    padding: 20,
  },
  exploreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
   bottomNav: {
    height: 60,
    backgroundColor: '#7B1FA2', // Dark purple
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#D1C4E9',
  },
});

export default MainDashboard;