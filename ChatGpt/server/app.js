// Import required packages
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from "cors";
import mongoose from "mongoose"; // Import Mongoose

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected successfully to MongoDB Atlas!");
});

// Define MongoDB schema and model
const chatSchema = new mongoose.Schema({
  message: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// Define your route handlers
const fn = (req, res) => {
  res.send("Hello World!!");
};

app.get("/", fn);

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  // Save the incoming message to MongoDB
  const newMessage = new Chat({
    message: messages[messages.length - 1].content,
    response: "", // You can update this when you receive the OpenAI response
  });

  try {
    await newMessage.save(); // Save the message to MongoDB
  } catch (error) {
    console.log(error, "error saving message to MongoDB");
  }

  // Your existing OpenAI API call remains unchanged
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
    ],
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        ...data,
        messages: [...data.messages, ...messages],
      }),
    });
    const json = await response.json();

    // Update the MongoDB document with the OpenAI response
    await Chat.updateOne({ _id: newMessage._id }, { response: json.choices[0].message.content });

    // Send the response to the client
    res.json({ question: messages, answer: json.choices });
  } catch (error) {
    console.log(error, "error calling OpenAI API");
    res.status(500).send("Error processing your request");
  }
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running");
});
