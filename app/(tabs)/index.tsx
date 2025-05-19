import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTaskStore } from '@/store/taskStore';
import TaskItem from '@/components/TaskItem';
import TaskInput from '@/components/TaskInput';
import TaskFilter from '@/components/TaskFilter';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { Trash } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Task } from '@/types/task';

export default function TasksScreen() {
  const { 
    tasks, 
    filter, 
    addTask, 
    toggleTask, 
    deleteTask, 
    setFilter, 
    getFilteredTasks,
    clearCompletedTasks
  } = useTaskStore();

  const filteredTasks = getFilteredTasks();
  
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  const handleClearCompleted = () => {
    clearCompletedTasks();
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const renderItem = useCallback(({ item }: { item: Task }) => (
    <TaskItem 
      task={item} 
      onToggle={toggleTask} 
      onDelete={deleteTask} 
    />
  ), [toggleTask, deleteTask]);

  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        {taskCounts.completed > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearCompleted}
            activeOpacity={0.7}
          >
            <Trash size={16} color={Colors.light.subtext} />
            <Text style={styles.clearButtonText}>Clear completed</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TaskInput onAddTask={addTask} />
      
      <TaskFilter 
        currentFilter={filter} 
        onFilterChange={setFilter} 
        taskCounts={taskCounts}
      />
      
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState filter={filter} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 4,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});