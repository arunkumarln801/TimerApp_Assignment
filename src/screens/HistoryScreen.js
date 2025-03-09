import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { TimerContext } from '../context/TimerContext';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';

const HistoryScreen = ({ navigation }) => {
  const { history, clearHistory } = useContext(TimerContext);

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all history?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", onPress: clearHistory, style: "destructive" }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const exportToExcel = async () => {
    try {
      // Prepare data for Excel
      const excelData = history.map(item => ({
        'Timer Name': item.timerName,
        'Category': item.category,
        'Duration (seconds)': item.duration,
        'Completed At': formatDate(item.completedAt),
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Timer History");

      // Generate Excel file
      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

      // Define file path
      const fileName = `TimerHistory_${new Date().toISOString().split('T')[0]}.xlsx`;
      const filePath = Platform.OS === 'ios' 
        ? RNFS.DocumentDirectoryPath + '/' + fileName
        : RNFS.DownloadDirectoryPath + '/' + fileName;

      // Write file to device
      await RNFS.writeFile(filePath, wbout, 'ascii');

      Alert.alert(
        'Success',
        `Excel file exported successfully!\nSaved to: ${filePath}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to export to Excel: ' + error.message,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Back to Timers</Text>
        </TouchableOpacity>
        
        <View style={styles.rightButtons}>
          <TouchableOpacity 
            style={styles.exportButton} 
            onPress={exportToExcel}
          >
            <Text style={styles.buttonText}>Export to Excel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearHistory}
          >
            <Text style={styles.buttonText}>Clear History</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.title}>Timer History</Text>
      
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No timer history yet</Text>
        </View>
      ) : (
        <FlatList
          data={history.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyName}>{item.timerName}</Text>
              <Text style={styles.historyDetails}>
                Category: <Text style={styles.highlighted}>{item.category}</Text>
              </Text>
              <Text style={styles.historyDetails}>
                Duration: <Text style={styles.highlighted}>{item.duration} seconds</Text>
              </Text>
              <Text style={styles.historyDetails}>
                Completed: <Text style={styles.highlighted}>{formatDate(item.completedAt)}</Text>
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    backgroundColor: '#9b32a8',
    padding: 10,
    borderRadius: 5,
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: '#e24a4a',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: "800"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center'
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  historyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  historyDetails: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  highlighted: {
    color: '#9b32a8',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontStyle: 'italic',
  },
});

export default HistoryScreen;