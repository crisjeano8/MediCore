import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { auth } from "../../firebaseConfig";
import { useGoals } from "../../hooks/useGoals";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

const severityOptions = [
  { label: "😌 Mild", value: "Mild" },
  { label: "🤕 Moderate", value: "Moderate" },
  { label: "🤒 Severe", value: "Severe" },
  { label: "🆘 Critical", value: "Critical" },
];

const CreatePatient = () => {
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [medication, setMedication] = useState("");
  const [severity, setSeverity] = useState("Mild");

  const { createGoal } = useGoals();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!patientName.trim() || !medication.trim()) return;

    await createGoal({
      patientName,
      gender,
      age,
      contact,
      medicalHistory,
      medication,
      severity,
      status: "Pending",
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    setPatientName("");
    setGender("");
    setAge("");
    setContact("");
    setMedicalHistory("");
    setMedication("");
    setSeverity("Mild");

    Keyboard.dismiss();
    router.push("/goals");
  };

  const renderInput = (label, value, setValue, placeholder, icon) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome5
          name={icon}
          size={16}
          color="#6B7280"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add Patient Record</Text>

        <LinearGradient colors={["#ffffffcc", "#f0fdf4cc"]} style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Info</Text>
          {renderInput("Name", patientName, setPatientName, "Juan Dela Cruz", "user")}
          {renderInput("Gender", gender, setGender, "Male / Female / Other", "venus-mars")}
          {renderInput("Age", age, setAge, "35", "birthday-cake")}
          {renderInput("Contact / Address", contact, setContact, "+639123456789 / House #12", "phone")}

          <Text style={styles.sectionTitle}>Medical Info</Text>
          {renderInput("Medical History / Notes", medicalHistory, setMedicalHistory, "Allergic to penicillin...", "notes-medical")}
          {renderInput("Medication / Treatment", medication, setMedication, "Paracetamol 500mg", "pills")}

          <Text style={styles.sectionTitle}>Severity Level</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={severity}
              onValueChange={(itemValue) => setSeverity(itemValue)}
              style={styles.picker}
            >
              {severityOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Floating Button */}
      <Pressable onPress={handleSubmit} style={styles.fab}>
        <LinearGradient colors={["#22C55E", "#16A34A"]} style={styles.fabGradient}>
          <FontAwesome5 name="save" size={18} color="white" />
          <Text style={styles.fabText}>Save Patient</Text>
        </LinearGradient>
      </Pressable>
    </SafeAreaView>
  );
};

export default CreatePatient;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollContent: { padding: 20, paddingBottom: 100 }, // extra bottom space so scroll doesn’t overlap button
  title: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 24, textAlign: "center" },
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937", marginVertical: 12 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#4B5563", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 15 },
  pickerWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },
  picker: { width: "100%", height: 50 },

  // Floating Action Button styles
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 5,
    marginBottom: 60,
  },
  fabGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  fabText: { color: "white", fontSize: 16, fontWeight: "700", marginLeft: 8 },
});
