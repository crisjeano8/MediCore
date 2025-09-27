import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Icon above title */}
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name="hospital-building" size={80} color="#4ade80" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Medicore</Text>
      <Text style={styles.subtitle}>Your Personal Healthcare Companion</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/goals")}>
        <MaterialCommunityIcons name="clipboard-list" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>View Patients</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push("/goals/create")}>
        <MaterialCommunityIcons name="plus-circle" size={20} color="#2563EB" style={{ marginRight: 8 }} />
        <Text style={[styles.buttonText, { color: "#2563EB" }]}>Add Patient</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F0FDF4", // soft healthcare green
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    width: "80%",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  secondaryButton: {
    backgroundColor: "#D1FAE5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Home;
