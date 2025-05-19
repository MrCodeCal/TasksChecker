import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/colors";
import { CheckSquare, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.subtext,
        tabBarStyle: {
          borderTopColor: Colors.light.border,
        },
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.light.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => <CheckSquare size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}