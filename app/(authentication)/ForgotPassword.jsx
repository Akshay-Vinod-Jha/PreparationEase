import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ForgotPasswordScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const ImageSource = require("../../images/Logo.png");

  return (
    <View style={styles.container}>
      {/* Illustration Placeholder */}
      <View style={styles.imageContainer}>
        <Image source={ImageSource} style={styles.illustration} />
      </View>

      {/* Title and Description */}
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>Trouble signing in? Reset your password now!</Text>

      {/* New Password Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#000"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#000"
          secureTextEntry={!confirmPasswordVisible}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        >
          <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Confirm Change Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirm Change</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D0B4E3",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  illustration: {
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3E2A68",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#3E2A68",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    marginBottom: 10,
    paddingRight: 15,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#000",
  },
  eyeIcon: {
    padding: 10,
  },
  confirmButton: {
    backgroundColor: "#744DA9",
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
