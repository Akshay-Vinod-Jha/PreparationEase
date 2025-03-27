import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import TextLink from "@/components/TextLink";
import { Colors } from "@/styles/Colors";
import { Image } from "react-native";
import { useRouter } from "expo-router";
const PrepaseLogo = require("../images/PrepaseLogo.jpg");
const AppLogo = require("../images/Logo.png");
import { StatusBar } from 'react-native';
const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Implement login logic here
    console.log("Login attempt with:", username);
    router.push("/(dashboard)/MainDashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const goToRegister = () => {
    console.log("opening register page");
    router.push("/Register");
  };
  const goToForgotPassword = () => {
    console.log("opening forgot password page");
    router.push("/ForgotPassword");
  }
  return (
    <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="#E6E0FF" barStyle="dark-content" />
      <View style={styles.upper}>
        <Image source={AppLogo} style={styles.imageStyle} />
        <Image source={PrepaseLogo} />
        <Text style={styles.tagline}>MAKING LEARNING EASY</Text>
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter Your Username here"
        />

        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          showPasswordToggle
          placeholder={"Enter Your Password Here"}
          onTogglePassword={togglePasswordVisibility}
        />

        <Button title="Login" onPress={handleLogin} />

        <TextLink
          text="Forgot Password?"
          onPress={() => goToForgotPassword()}
          style={styles.forgotPassword}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TextLink
            text="Register"
            onPress={() => {
              goToRegister();
            }}
            style={styles.registerLink}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 150, // Adjust size as needed
    height: 150, // Ensures the image is square
    resizeMode: "contain", // Ensures the image fits within the given dimensions
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  upper: {
    height: Dimensions.get("window").height * 0.35,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  tagline: {
    color: "black",
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "bold",
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 12,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 24,
  },
  footerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontWeight: "bold",
    fontSize: 14,
    color: Colors.textDark,
  },
  registerLink: {
    marginLeft: 4,
  },
});

export default LoginScreen;
