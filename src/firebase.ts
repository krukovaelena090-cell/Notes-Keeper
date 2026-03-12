import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBEFNzO92yq1qqxpyVS99RAuZwtz2J-_RqM',
  authDomain: 'notes-keeper-vk.firebaseapp.com',
  projectId: 'notes-keeper-vk',
  storageBucket: 'notes-keeper-vk.firebasestorage.app',
  messagingSenderId: '950628639676',
  appId: '1:950628639676:web:2e61d056d5ac2bd31601b9'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)