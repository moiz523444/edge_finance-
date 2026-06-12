import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web' && typeof window !== 'undefined';

/**
 * Safely saves a key-value pair in secure storage.
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`[SecureStore Error] Failed to set item for key: ${key}`, error);
  }
}

/**
 * Retrieves a value by key from secure storage.
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`[SecureStore Error] Failed to get item for key: ${key}`, error);
    return null;
  }
}

/**
 * Deletes a value by key from secure storage.
 */
export async function deleteSecureItem(key: string): Promise<void> {
  try {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`[SecureStore Error] Failed to delete item for key: ${key}`, error);
  }
}

// Convenience session helpers
export const saveToken = (token: string) => setSecureItem('authToken', token);
export const getToken = () => getSecureItem('authToken');
export const deleteToken = () => deleteSecureItem('authToken');

export const saveRefreshToken = (token: string) => setSecureItem('refreshToken', token);
export const getRefreshToken = () => getSecureItem('refreshToken');
export const deleteRefreshToken = () => deleteSecureItem('refreshToken');

export const saveIdNumber = (idNumber: string) => setSecureItem('idNumber', idNumber);
export const getIdNumber = () => getSecureItem('idNumber');
export const deleteIdNumber = () => deleteSecureItem('idNumber');
