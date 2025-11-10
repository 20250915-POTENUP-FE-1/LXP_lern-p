import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from './firebaseApp';

export const db = getFirestore(firebaseApp);
