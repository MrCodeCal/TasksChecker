import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';
import { CheckCircle } from 'lucide-react-native';

interface EmptyStateProps {
  filter: string;
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const getMessage = () => {
    switch (filter) {
      case 'active':
        return "You've completed all your tasks!";
      case 'completed':
        return "You haven't completed any tasks yet.";
      default:
        return "Your task list is empty. Add a task to get started!";
    }
  };

  return (
    <View style={styles.container}>
      <CheckCircle size={64} color={Colors.light.primary} style={styles.icon} />
      <Text style={styles.message}>{getMessage()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  message: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    lineHeight: 24,
  },
});