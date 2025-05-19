import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTaskStore } from '@/store/taskStore';
import Colors from '@/constants/colors';
import { Save, ArrowLeft, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, updateTask } = useTaskStore();
  
  const task = tasks.find(t => t.id === id);
  
  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [tag, setTag] = useState(task?.tag || '');
  
  const tags = ['Personal', 'Work', 'Shopping', 'Urgent'];

  useEffect(() => {
    if (!task) {
      router.back();
    }
  }, [task, router]);

  const handleSave = () => {
    if (!task || !title.trim()) return;
    
    updateTask({
      ...task,
      title: title.trim(),
      notes: notes.trim(),
      tag: tag || undefined,
    });
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    router.back();
  };

  if (!task) return null;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen 
        options={{
          title: 'Edit Task',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSave}
              disabled={!title.trim()}
              style={[
                styles.saveButton,
                !title.trim() && styles.saveButtonDisabled
              ]}
            >
              <Save size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={Colors.light.placeholder}
            autoCapitalize="sentences"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes (optional)"
            placeholderTextColor={Colors.light.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tag</Text>
          <View style={styles.tagContainer}>
            {tags.map((tagName) => (
              <TouchableOpacity
                key={tagName}
                style={[
                  styles.tagButton,
                  tag === tagName && styles.tagButtonSelected,
                ]}
                onPress={() => setTag(tag === tagName ? '' : tagName)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tagButtonText,
                    tag === tagName && styles.tagButtonTextSelected,
                  ]}
                >
                  {tagName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {task.completionCount > 0 && (
          <View style={styles.completionInfo}>
            <RotateCcw size={16} color={Colors.light.primary} />
            <Text style={styles.completionText}>
              Completed {task.completionCount} {task.completionCount === 1 ? 'time' : 'times'}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.subtext,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.card,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tagButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  tagButtonText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  tagButtonTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.placeholder,
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  completionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  completionText: {
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 8,
  },
});