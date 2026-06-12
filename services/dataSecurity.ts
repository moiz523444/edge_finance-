import forge from 'node-forge';

const SECRET_KEY_HEX = '4a5e3d8c2b7f1a9e6d8c3b2a7f1e9d6c4a5e3d8c2b7f1a9e6d8c3b2a7f1e9d6c';

// Convert the hex secret key into bytes
const keyBytes = forge.util.hexToBytes(SECRET_KEY_HEX);

/**
 * Encrypts data using AES-GCM 256-bit with the secret key.
 * Prepends the 12-byte IV to the ciphertext and auth tag.
 * Returns a Base64 string of the combined buffer.
 * Matches standard Web Crypto Subtle AES-GCM output exactly.
 */
export function encryptData(data: unknown): string {
  try {
    const jsonString = JSON.stringify(data);
    const dataBytes = forge.util.encodeUtf8(jsonString);

    // Generate a cryptographically secure 12-byte IV
    const ivBytes = forge.random.getBytesSync(12);

    const cipher = forge.cipher.createCipher('AES-GCM', keyBytes);
    cipher.start({
      iv: ivBytes,
      tagLength: 128, // 16 bytes auth tag
    });
    cipher.update(forge.util.createBuffer(dataBytes));
    cipher.finish();

    const ciphertextBytes = cipher.output.getBytes();
    const tagBytes = cipher.mode.tag.getBytes();

    // Combine: IV + Ciphertext + Tag
    const combinedBytes = ivBytes + ciphertextBytes + tagBytes;

    // Convert combined binary string to Base64
    return forge.util.encode64(combinedBytes);
  } catch (error) {
    console.error('[Encryption Error]', error);
    throw new Error('Failed to encrypt data.');
  }
}

/**
 * Decrypts a Base64 encoded string using AES-GCM.
 * Extracts the 12-byte IV, Ciphertext, and 16-byte Auth Tag.
 * Matches standard Web Crypto Subtle AES-GCM decryption exactly.
 */
export function decryptDetails(encryptedDataBase64: string): any {
  try {
    // Standardize Base64 (handle URL-safe base64 if any)
    const normalized = encryptedDataBase64.replace(/-/g, '+').replace(/_/g, '/');
    const combinedBytes = forge.util.decode64(normalized);

    if (combinedBytes.length < 28) {
      throw new Error('Invalid encrypted data length.');
    }

    // Extract: 12-byte IV
    const ivBytes = combinedBytes.slice(0, 12);
    // Extract: ciphertext & 16-byte tag
    const encryptedBytesWithTag = combinedBytes.slice(12);
    const ciphertextBytes = encryptedBytesWithTag.slice(0, -16);
    const tagBytes = encryptedBytesWithTag.slice(-16);

    const decipher = forge.cipher.createDecipher('AES-GCM', keyBytes);
    decipher.start({
      iv: ivBytes,
      tag: forge.util.createBuffer(tagBytes),
      tagLength: 128,
    });
    decipher.update(forge.util.createBuffer(ciphertextBytes));
    const success = decipher.finish();

    if (!success) {
      throw new Error('Decryption integrity/authentication failed.');
    }

    const decryptedStr = forge.util.decodeUtf8(decipher.output.getBytes());

    try {
      const jsonObject = JSON.parse(decryptedStr);
      // Double JSON parse fallback for nested JSON wrapping
      return typeof jsonObject === 'string' ? JSON.parse(jsonObject) : jsonObject;
    } catch {
      return decryptedStr;
    }
  } catch (error) {
    console.error('[Decryption Error]', error);
    throw new Error('Failed to decrypt data.');
  }
}
