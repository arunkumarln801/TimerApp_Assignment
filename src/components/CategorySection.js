import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import TimerCard from './TimerCard';
import { useTheme } from '../styles/theme';

const CategorySection = ({ category, timers, onUpdate, onComplete, filter }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const filteredTimers = timers.filter((t) => (filter ? t.category === filter : true) && t.category === category);

  const handleBulkAction = (status) => {
    filteredTimers.forEach((t) => onUpdate({ ...t, status }));
  };

  const handleResetAll = () => {
    filteredTimers.forEach((t) => onUpdate({ ...t, remaining: t.duration, status: 'Paused' }));
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={[styles.categoryTitle, { color: theme.accent }]}>
          {category} ({filteredTimers.length})
        </Text>
      </TouchableOpacity>
      {isExpanded && (
        <>
          <View style={styles.bulkActions}>
            <TouchableOpacity onPress={() => handleBulkAction('Running')}>
              <Text style={[styles.bulkActionText, { color: theme.accent }]}>Start All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleBulkAction('Paused')}>
              <Text style={[styles.bulkActionText, { color: theme.accent }]}>Pause All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResetAll}>
              <Text style={[styles.bulkActionText, { color: theme.accent }]}>Reset All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredTimers}
            renderItem={({ item }) => (
              <TimerCard timer={item} onUpdate={onUpdate} onComplete={onComplete} />
            )}
            keyExtractor={(item) => item.id}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bulkActionText: {
    fontSize: 14,
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
});

export default CategorySection;