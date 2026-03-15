import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAeLsFV9TSmhDHgAaZF5BLgatxPTr_pcxs",
  authDomain: "buspoint-1a267.firebaseapp.com",
  projectId: "buspoint-1a267",
  storageBucket: "buspoint-1a267.firebasestorage.app",
  messagingSenderId: "406513723808",
  appId: "1:406513723808:web:da42aa7ba4892a91281cc5"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
