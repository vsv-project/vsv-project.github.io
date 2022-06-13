import { initializeApp } from "firebase/app";
import express from "express";
import path from "path";
import { createServer} from "http";
import { Server } from "socket.io";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const PORT = process.env.PORT || 3001;
const firebaseConfig = {
  apiKey: "AIzaSyBDK0n1WIWcU6h-_OrmtqvAY1acBRS7fHg",
  authDomain: "clompass-chat-app.firebaseapp.com",
  projectId: "clompass-chat-app",
  storageBucket: "clompass-chat-app.appspot.com",
  messagingSenderId: "319826122916",
  appId: "1:319826122916:web:44bf4e1bc13acdc8b4ae31"
};
const fapp = initializeApp(firebaseConfig);
const auth = getAuth(fapp);

//signInWithEmailAndPassword(auth, email, password)
//  .then((userCredential) => {
//    // Signed in 
//    const user = userCredential.user;
//  })
//  .catch((error) => {
//    const errorCode = error.code;
//    const errorMessage = error.message;
//    console.log(errorCode, errorMessage);
//  });
//signOut(auth).then(() => {
//  // Sign-out successful.
//}).catch((error) => {
//  console.log(error);
//});

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));
const server = createServer(app);

const io = new Server(server)

const socket_app = io.of("/api")
socket_app.on("connection", (socket) => {
  console.log("connected");
  socket.on("disconnect", () => {
    console.log("disconnected");
  })
  socket.on("signup", (data) => {
    console.log(data);  // {email, password}
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up successfully. 
      const user = userCredential.user || null;
      const status = "success"
      console.log(user)
      socket.emit("signup", {timestamp: new Date().toUTCString(), status: status, data: {user: user}});
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const status = "failure"
      console.log(errorCode, errorMessage);
      socket.emit("signup", {timestamp: new Date().toUTCString(), status: status, data: {errorCode: errorMessage}});
    });
  });
});



app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});