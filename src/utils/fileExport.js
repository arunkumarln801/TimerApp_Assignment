import * as FileSystem from 'react-native-fs';

export const exportToJSON = async (data, fileName = 'timer_history.json') => {
  try {
    const json = JSON.stringify(data, null, 2);
    const path = `${FileSystem.DocumentDirectoryPath}/${fileName}`;
    await FileSystem.writeFile(path, json, 'utf8');
    return path;
  } catch (e) {
    console.error('Failed to export:', e);
    throw e;
  }
};