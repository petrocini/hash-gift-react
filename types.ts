export interface Participant {
  id: string;
  name: string;
}

export interface EncryptedPair {
  giverName: string;
  encryptedReceiver: string;
}

export enum AppState {
  SETUP = 'SETUP',
  GENERATED = 'GENERATED',
  REVEALING = 'REVEALING'
}