import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import LogoHeader from "@/components/LogoHeader";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LogoHeader />

      <InputField
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
      />

      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry={securePassword}
        showPasswordToggle
        onTogglePassword={() => setSecurePassword(!securePassword)}
      />

      <InputField
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        secureTextEntry={secureConfirmPassword}
        showPasswordToggle
        onTogglePassword={() =>
          setSecureConfirmPassword(!secureConfirmPassword)
        }
      />

      <Button title="Register" onPress={() => alert("Registered!")} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F5FC",
    paddingHorizontal: 20,
  },
});

export default RegisterScreen;
