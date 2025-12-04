import CryptoJS from 'crypto-js';

const SECRET_KEY = "SANTA_CLAUS_IS_COMING_TO_TOWN_SECRET_KEY_2024";

export const encryptName = (text: string): string => {
  const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  return encodeURIComponent(encrypted);
};

export const decryptName = (cipherText: string): string => {
  try {
    const decoded = decodeURIComponent(cipherText);
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!originalText) throw new Error("Decryption failed");
    
    return originalText;
  } catch (error) {
    console.error("Erro na descriptografia:", error);
    return "";
  }
};