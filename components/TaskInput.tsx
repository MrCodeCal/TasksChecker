import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Keyboard } from 'react-native';
import Colors from '@/constants/colors';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [text, setText] = useState('');

  const handleAddTask = () => {
    if (text.trim()) {
      onAddTask(text);
      setText('');
      Keyboard.dismiss();
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        placeholderTextColor={Colors.light.placeholder}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAddTask}
        returnKeyType="done"
        autoCapitalize="sentences"
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          !text.trim() && styles.addButtonDisabled
        ]}
        onPress={handleAddTask}
        disabled={!text.trim()}
        activeOpacity={0.7}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.light.text,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonDisabled: {
    backgroundColor: Colors.light.placeholder,
    shadowOpacity: 0.2,
  },
});