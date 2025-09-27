import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GoalsProvider } from "../../contexts/GoalsContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Platform } from "react-native";

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      }
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#2563EB",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 0,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 6,
            height: Platform.OS === "ios" ? 80 : 70,
            paddingBottom: Platform.OS === "ios" ? 20 : 12,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "absolute",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Patients",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={24}
                name={focused ? "people" : "people-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Add Patient",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={26}
                name={focused ? "add-circle" : "add-circle-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen name="edit/[id]" options={{ href: null }} />
        <Tabs.Screen name="[id]" options={{ href: null }} />
      </Tabs>
    </GoalsProvider>
  );
}
