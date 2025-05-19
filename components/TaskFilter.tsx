import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { TaskFilter as FilterType } from '@/types/task';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function TaskFilter({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: `All (${taskCounts.all})` },
    { key: 'active', label: `Active (${taskCounts.active})` },
    { key: 'completed', label: `Completed (${taskCounts.completed})` },
  ];

  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterButton,
            currentFilter === filter.key && styles.filterButtonActive,
          ]}
          onPress={() => onFilterChange(filter.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              currentFilter === filter.key && styles.filterTextActive,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.subtext,
  },
  filterTextActive: {
    color: '#fff',
  },
});