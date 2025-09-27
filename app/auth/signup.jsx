import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/"); // redirect to home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <LinearGradient colors={["#F0FDF4", "#E0F7EF"]} style={styles.background} />

      {/* Icon */}
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name="hospital-building" size={80} color="#4ade80" />
      </View>

      <Text style={styles.title}>Medicore Signup</Text>

      <View style={styles.inputWrapper}>
        <MaterialCommunityIcons name="email-outline" size={20} color="#4B5563" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputWrapper}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#4B5563" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <LinearGradient colors={["#2563EB", "#1E40AF"]} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Signup</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/auth/login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  background: { ...StyleSheet.absoluteFillObject },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  title: { fontSize: 28, fontWeight: "700", color: "#1E40AF", marginBottom: 24, textAlign: "center" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  error: { color: "#DC2626", marginBottom: 16, textAlign: "center" },
  button: { width: "100%", borderRadius: 16, overflow: "hidden", marginVertical: 10 },
  buttonGradient: { padding: 16, alignItems: "center", borderRadius: 16 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  linkButton: { marginTop: 12 },
  linkText: { color: "#2563EB", fontWeight: "600", textAlign: "center" },
});
