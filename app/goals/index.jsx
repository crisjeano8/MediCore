import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "goals"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPatients(list);
    });

    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "goals", id));
      setSelectedPatient(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/auth/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const severityColors = {
    Mild: "#10B981",
    Moderate: "#2563EB",
    Severe: "#F59E0B",
    Critical: "#DC2626",
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/goals/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <LinearGradient
          colors={[severityColors[item.severity] + "cc", severityColors[item.severity]]}
          style={styles.severityBadge}
        >
          <Text style={styles.severityText}>{item.severity}</Text>
        </LinearGradient>
        <Pressable onPress={() => setSelectedPatient(item)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
        </Pressable>
      </View>
      <Text style={styles.dateText}>
        Added: {item.createdAt?.toDate().toLocaleDateString()}
      </Text> 
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Patients</Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No patients yet.</Text>}
      />

      {/* Modal for Edit/Delete */}
      <Modal visible={!!selectedPatient} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPressOut={() => setSelectedPatient(null)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            
            <Pressable
              style={styles.modalItem}
              onPress={() => handleDelete(selectedPatient.id)}
            >
              <Text style={[styles.modalText, { color: "#DC2626" }]}>Delete</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Floating Logout Button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={28} color="white" />
      </Pressable>
    </SafeAreaView>
  );
};

export default Patients;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 16, color: "#111827" },
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  patientName: { fontSize: 18, fontWeight: "700", flex: 1, color: "#111827" },
  severityBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  severityText: { color: "white", fontWeight: "600", fontSize: 14 },
  dateText: { fontSize: 13, color: "#6B7280", marginTop: 6 },
  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 40, fontStyle: "italic" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalItem: { paddingVertical: 12 },
  modalText: { fontSize: 16, fontWeight: "600", color: "#2563EB" },
  logoutButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#DC2626",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    marginBottom: 60,
  },
});
