import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice'; // 경로 확인

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Combine reducers
const rootReducer = {
  auth: persistReducer(persistConfig, authReducer),
};

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Define RootState
export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);
