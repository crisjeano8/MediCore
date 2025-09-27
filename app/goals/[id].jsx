import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const severityColors = {
  Mild: ["#34D399", "#059669"],       // green gradient
  Moderate: ["#60A5FA", "#2563EB"],  // blue gradient
  Severe: ["#FBBF24", "#F59E0B"],    // orange gradient
  Critical: ["#F87171", "#DC2626"],  // red gradient
};

const PatientDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "goals", id), (docSnap) => {
      if (docSnap.exists()) setPatient({ id: docSnap.id, ...docSnap.data() });
      else setPatient(null);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  if (!patient)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );

  return (
    <LinearGradient colors={["#F9FAFB", "#EEF2FF"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{patient.patientName}</Text>
          <Text style={styles.subtitle}>Patient Profile</Text>

          <LinearGradient
            colors={severityColors[patient.severity]}
            style={styles.severityBadge}
          >
            <Text style={styles.severityText}>{patient.severity}</Text>
          </LinearGradient>
        </View>

        {/* Patient Info Cards */}
        <View style={styles.card}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{patient.gender || "N/A"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{patient.age || "N/A"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Contact / Address</Text>
          <Text style={styles.value}>{patient.contact || "N/A"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Medical History / Notes</Text>
          <Text style={styles.value}>{patient.medicalHistory || "N/A"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Medication / Treatment</Text>
          <Text style={styles.value}>{patient.medication || "N/A"}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <LinearGradient colors={["#2563EB", "#1E40AF"]} style={styles.button}>
            <Pressable
              style={styles.buttonContent}
              onPress={() => router.push(`/goals/edit/${patient.id}`)}
            >
              <Ionicons name="create-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
          </LinearGradient>

          <LinearGradient colors={["#9CA3AF", "#6B7280"]} style={styles.button}>
            <Pressable
              style={styles.buttonContent}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PatientDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },

  header: { alignItems: "center", marginBottom: 24, marginTop: 20 },
  name: { fontSize: 30, fontWeight: "800", color: "#111827", marginTop: 40, },
  subtitle: { fontSize: 16, color: "#6B7280", marginTop: 4 },
  severityBadge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginTop: 14,
  },
  severityText: { color: "white", fontWeight: "700", fontSize: 15 },

  card: {
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#6B7280", marginBottom: 4 },
  value: { fontSize: 16, color: "#111827", fontWeight: "500" },

  buttonRow: {
    marginTop: 30,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});
