import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

const storage = new Storage({
  size: 1,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

export default storage;
