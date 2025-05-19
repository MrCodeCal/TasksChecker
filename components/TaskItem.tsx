import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { Task } from '@/types/task';
import Colors from '@/constants/colors';
import { Check, Trash2, Edit, RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const router = useRouter();
  
  const handleToggle = () => {
    onToggle(task.id);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleEdit = () => {
    router.push(`/edit-task/${task.id}`);
  };
  
  const handleDelete = () => {
    onDelete(task.id);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const getTagStyle = () => {
    if (!task.tag) return null;
    
    const tagMap: Record<string, any> = {
      'Personal': { backgroundColor: Colors.light.tag1 },
      'Work': { backgroundColor: Colors.light.tag2 },
      'Shopping': { backgroundColor: Colors.light.tag3 },
      'Urgent': { backgroundColor: Colors.light.tag4 },
    };
    
    return tagMap[task.tag] || { backgroundColor: Colors.light.tag1 };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={[
          styles.checkbox, 
          task.completed && styles.checkboxChecked
        ]}>
          {task.completed && <Check size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text 
          style={[
            styles.title, 
            task.completed && styles.titleCompleted
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        
        {task.notes && (
          <Text 
            style={styles.notes}
            numberOfLines={1}
          >
            {task.notes}
          </Text>
        )}
        
        <View style={styles.metaContainer}>
          {task.tag && (
            <View style={[styles.tag, getTagStyle()]}>
              <Text style={styles.tagText}>{task.tag}</Text>
            </View>
          )}
          
          {task.completionCount > 0 && (
            <View style={styles.completionCount}>
              <RotateCcw size={12} color={Colors.light.subtext} />
              <Text style={styles.completionCountText}>
                {task.completionCount} {task.completionCount === 1 ? 'time' : 'times'}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actions}>
        <Pressable 
          style={styles.actionButton} 
          onPress={handleEdit}
          hitSlop={8}
        >
          <Edit size={18} color={Colors.light.subtext} />
        </Pressable>
        
        <Pressable 
          style={styles.actionButton} 
          onPress={handleDelete}
          hitSlop={8}
        >
          <Trash2 size={18} color={Colors.light.subtext} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.light.completed,
  },
  notes: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  completionCountText: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
});