// import React, { useState } from "react";
// import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
// import LogoHeader from "@/components/LogoHeader";
// import InputField from "@/components/InputField";
// import Button from "@/components/Button";

// const RegisterScreen = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [securePassword, setSecurePassword] = useState(true);
//   const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <LogoHeader />

//       <InputField
//         label="Username"
//         value={username}
//         onChangeText={setUsername}
//         placeholder="Enter your username"
//       />

//       <InputField
//         label="Password"
//         value={password}
//         onChangeText={setPassword}
//         placeholder="Enter password"
//         secureTextEntry={securePassword}
//         showPasswordToggle
//         onTogglePassword={() => setSecurePassword(!securePassword)}
//       />

//       <InputField
//         label="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         placeholder="Confirm password"
//         secureTextEntry={secureConfirmPassword}
//         showPasswordToggle
//         onTogglePassword={() =>
//           setSecureConfirmPassword(!secureConfirmPassword)
//         }
//       />

//       <Button title="Register" onPress={() => alert("Registered!")} />
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8F5FC",
//     paddingHorizontal: 20,
//   },
// });

// export default RegisterScreen;
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const ImageSource = require("../../images/Logo.png");

  return (
    <View style={styles.container}>
      {/* Circular Background with Logo */}
      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          <Image source={ImageSource} style={styles.logo} />
          <Text style={styles.subtitleBlack}>MAKING LEARNING EASY</Text>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.inputContainer}>
        {/* Username Field */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="StudentName|23456789"
          placeholderTextColor="#000"
        />

        {/* Password Field */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputField}
            secureTextEntry={!passwordVisible}
            placeholder="********"
            placeholderTextColor="#000"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Field */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputField}
            secureTextEntry={!confirmPasswordVisible}
            placeholder="********"
            placeholderTextColor="#000"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Ionicons
              name={confirmPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Register</Text>
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
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#744DA9",
    width: 300, 
    height: 300, 
    borderRadius: 150,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  circle: {
    width: 280, 
    height: 280, 
    backgroundColor: "#744DA9", 
    borderRadius: 140, 
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },
  subtitleBlack: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    marginTop: 10,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3E2A68",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    width: "100%",
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    paddingRight: 40,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#000",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  registerButton: {
    backgroundColor: "#744DA9",
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;




