// gps_tracker_server/index.js
// require("dotenv").config();
const net = require("net");
// const { initializeApp } = require("firebase/app");
// const { getFirestore, doc, setDoc, Timestamp } = require("firebase/firestore");

// // Initialize Firebase
// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Create TCP Server
const server = net.createServer((socket) => {
  console.log("New GPS tracker connected.");

  socket.on("data", async (data) => {
    const rawData = data.toString();
    console.log("Received Data:", rawData);

    // Check if the data is in the expected format
    if (!rawData.startsWith("IMEI:")) {
      console.warn("Invalid data format received, ignoring.");
      return;
    }
    // Basic Parsing for Sinotrack-like devices (adjust based on your actual device)
    const parts = rawData.split(",");
    console.log("parts", parts);
    const imei = parts[0].split(":")[1];
    const lat = parseFloat(parts[7]);
    const lng = parseFloat(parts[9]);
    const speed = parseFloat(parts[11]);

    const trackingData = {
      latitude: lat,
      longitude: lng,
      speed: speed,
      timestamp: new Date().toISOString(),
      deviceId: imei,
    };

    // Save to Firestore (e.g., shipments/{imei}/tracking/{timestamp})
    try {
      console.log("Saved to Firestore:", trackingData);
    } catch (err) {
      console.error("Error saving to Firestore:", err);
    }
  });

  socket.on("error", (err) => {
    console.error("Connection error:", err);
  });

  socket.on("end", () => {
    console.log("Tracker disconnected.");
  });
});

const PORT = process.env.GPS_SERVER_PORT || 5055;
server.listen(PORT, () => {
  console.log(`GPS Tracker Server listening on port ${PORT}`);
});

// .env example (create a .env file)
// GPS_SERVER_PORT=5055
// FIREBASE_API_KEY=your_api_key
// FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
// FIREBASE_PROJECT_ID=your_project_id
// FIREBASE_STORAGE_BUCKET=your_project.appspot.com
// FIREBASE_MESSAGING_SENDER_ID=your_sender_id
// FIREBASE_APP_ID=your_app_id
