import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { generateRegistrationOptions } from '@simplewebauthn/server';

const CLIENT_URL = 'http://localhost:8080'; // Initialize CLIENT_URL

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

console.log(CLIENT_URL); // Access CLIENT_URL after initialization

app.use((req, res, next) => {
  const host = req.get('Host');
  console.log(`Host: ${host}`);
  next();
});

// Dummy implementation of getUserByEmail for demonstration purposes
function getUserByEmail(email) {
  // Replace this with your actual implementation
  return null;
}

// Dummy implementation of generateUserID for demonstration purposes
function generateUserID(email) {
  // Replace this with your actual implementation
  return Date.now(); // Example: using timestamp as userID
}

app.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (getUserByEmail(email) != null) {
      return res.status(400).json({ error: "User already exists" });
    }

    const userID = generateUserID(email); // Generate a numeric userID
    const options = await generateRegistrationOptions({ // Await the function call
      rpName: "SimpleWebAuthn Demo",
      rpID: "localhost",
      userID: userID, // Use numeric userID
      userName: email,
      attestationType: "none",
      excludeCredentials: [],
      authenticatorSelection: {
        requireResidentKey: false,
        userVerification: "preferred",
      },
      timeout: 60000,
    });

    console.log("Generated registration options:", options); // Log the options object

    res.json({ options });
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
