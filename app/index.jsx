import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import TextLink from "@/components/TextLink";
import { Colors } from "@/styles/Colors";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import "expo-dev-client";
import { db, setDoc, doc, getDoc } from "@/firebaseConfig";
const PrepaseLogo = require("../images/PrepaseLogo.jpg");
const AppLogo = require("../images/Logo.png");

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState("no-operation");
  const [issuereason, setIssueReason] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    console.log("username is:-", username, "password is:-", password);
    setLoginStatus("loading");
    try {
      // No false information
      if (!username.trim() || !password.trim()) {
        throw new Error("username and password cannot be empty");
      }

      // Checking already occupied or not username
      const snapshot = await getDoc(doc(db, "users", username));

      // If snapshot exists, username is already taken
      if (snapshot.exists()) {
        console.log("username is occupied");
        throw new Error("a username is already available");
      }

      // Username is available
      const data = await setDoc(doc(db, "users", username.trim()), {
        password: password.trim(),
      });

      setPassword(password.trim());
      setUsername(username.trim());
      console.log("status:success", data);
      setLoginStatus("success");
    } catch (error) {
      // Ensure we're handling the error correctly
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong, try again";

      setIssueReason(errorMessage);
      console.log("status:failure", errorMessage);
      setLoginStatus("issue");
    } finally {
      setTimeout(() => {
        setLoginStatus("no-operation");
      }, 2000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goToRegister = () => {
    console.log("opening register page");
    router.push("/Register");
  };

  return (
    <SafeAreaView style={styles.container}>
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

        {loginStatus === "no-operation" && (
          <Button title="Login" onPress={handleLogin} />
        )}
        {loginStatus === "loading" && (
          <Button
            title="Performing Authentication"
            onPress={() => {}}
            disabled
          />
        )}
        {loginStatus === "success" && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>
              Login Successful! Welcome, {username}
            </Text>
          </View>
        )}
        {loginStatus === "issue" && (
          <View style={styles.failureMessage}>
            <Text style={styles.failureText}>{issuereason}</Text>
          </View>
        )}
        <TextLink
          text="Forgot Password?"
          onPress={() => console.log("Forgot password pressed")}
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
    width: 150,
    height: 150,
    resizeMode: "contain",
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
  successMessage: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "stretch",
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  failureMessage: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "stretch",
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  successText: {
    color: "green",
    textAlign: "center",
    fontWeight: "600",
  },
  failureText: {
    color: "red",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default LoginScreen;
