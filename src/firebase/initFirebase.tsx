import { initializeApp } from "firebase/app"
const config = {
  apiKey: "AIzaSyBDK0n1WIWcU6h-_OrmtqvAY1acBRS7fHg",
  authDomain: "clompass-chat-app.firebaseapp.com",
  projectId: "clompass-chat-app",
  storageBucket: "clompass-chat-app.appspot.com",
  messagingSenderId: "319826122916",
  appId: "1:319826122916:web:44bf4e1bc13acdc8b4ae31"
}
const firebaseApp = initializeApp(config)

export default firebaseApp
export type FirebaseError = {
  code: string
  message: string
}
