import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "@/styles/Colors";
import FeatureList from "@/components/FeatureList";
// Features data remains the same
export const features = [
  {
    id: 1,
    name: "Detect Language",
    image: require("../../images/translate.png"),
    navigateTo: "/(tools)/(detectlanguage)/first",
  },
  {
    id: 2,
    name: "Translate Notes",
    image: require("../../images/Translator-amico.png"),
    navigateTo: "/(tools)/(translatenotes)/first",
  },
  {
    id: 3,
    name: "Analyze Notes",
    image: require("../../images/Research paper-amico.png"),
    navigateTo: "/(tools)/(analyzenotes)/first",
  },
  {
    id: 4,
    name: "Extract Keywords",
    image: require("../../images/Tabs-rafiki.png"),
    navigateTo: "/(tools)/(extractkeywords)/first",
  },
  {
    id: 5,
    name: "Visualize Notes",
    image: require("../../images/Notes-amico.png"),
    navigateTo: "/(tools)/(visualizenotes)/first",
  },
  {
    id: 6,
    name: "Check Grammar",
    image: require("../../images/Choose-rafiki.png"),
    navigateTo: "/(tools)/(checkgrammar)/first",
  },
  {
    id: 7,
    name: "Listen to Notes",
    image: require("../../images/Audiobook-pana.png"),
    navigateTo: "/(tools)/(textoaudio)/first",
  },
  {
    id: 8,
    name: "Images to Notes",
    image: require("../../images/imagetonote.png"),
    navigateTo: "/(tools)/(imagetonotes)/first",
  },
  {
    id: 9,
    name: "Handwritten Notes Converter",
    image: require("../../images/Notes-bro.png"),
    navigateTo: "/(tools)/(texttohand)/first",
  },
  {
    id: 10,
    name: "Share Your Notes",
    image: require("../../images/Photo Sharing-bro.png"),
    navigateTo: "/(tools)/(sharenotes)/first",
  },
];

const MainDashboard = () => {
  const { username } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("MainDashboard username is", username);
  }, [username]);
  const handleProfile = () => {
    router.push({
      pathname: "/(profile)/profile",
      params: {
        username,
      },
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.backgroundLight}
        barStyle="dark-content"
      />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.prepEaseText}>PREPEASE</Text>
        <TouchableOpacity onPress={handleProfile} style={styles.profileIcon}>
          <Icon name="person" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.nameText}>{username || "User"}!</Text>
          <Text style={styles.descriptionText}>
            Your Smart Study Companion! Analyze, Summarize & Optimize Notes
            Effortlessly
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(addnotes)/addnote",
                params: { username },
              })
            }
            style={[styles.getStartedButton, styles.marginBottom]}
          >
            <Text style={styles.getStartedText}>Add Your Note's</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() =>
              router.push({
                pathname: "/(dashboard)/GetStartedPrepase",
                params: {
                  username,
                },
              })
            }
          >
            <Text style={styles.getStartedText}>Get Started with PrepEase</Text>
          </TouchableOpacity>
        </View>

        {/* Explore Features Section */}
        <View style={styles.exploreSection}>
          <Text style={styles.exploreText}>Explore Our Powerful Features</Text>
        </View>

        {/* New Feature List Component */}
        <FeatureList
          features={features}
          navigation={router}
          username={username}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  prepEaseText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  nameText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 20,
  },
  marginBottom: {
    marginBottom: 4,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  getStartedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exploreSection: {
    padding: 20,
    paddingBottom: 10,
  },
  exploreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
});

export default MainDashboard;
