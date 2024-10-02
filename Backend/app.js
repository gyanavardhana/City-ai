require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const fs = require('fs');
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const fileManager = new GoogleAIFileManager(apiKey);

const upload = multer({ dest: './uploads/' });

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'https://city-ai-ten.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const footpathRoutes = require('./routes/footpathRoutes');
const filterRoutes = require('./routes/filterRoutes');
const imagemetaRoutes = require('./routes/imagemetaRoutes');

app.use('/users', userRoutes);
app.use('/maps', locationRoutes);
app.use('/opinions', reviewRoutes);
app.use('/assessments', footpathRoutes);
app.use('/categories', filterRoutes);
app.use('/images', imagemetaRoutes);





app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const mimeType = file.mimetype;
    const uploadResult = await fileManager.uploadFile(file.path, {
      mimeType,
      displayName: file.originalname,
    });
    const fileUrl = uploadResult.file.uri;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Detect the image or location in the image environment conditions such as polluted, safe, crowded, greenery, urban or any metadata etc and make them a list, only the labels and return them (only strings no iphen, comma, etc) please give only strings.",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: fileUrl,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());

    res.status(200).send({
      fileUrl,
      result: result.response.text(),
    });
  } catch (error) {
    console.error('Error uploading file or running Generative AI:', error);
    res.status(500).send({
      message: 'Error uploading file or running Generative AI',
    });
  }
});



app.post('/transcribe', upload.single('file'), async (req, res) => {
  try {
    const audio = req.file;
    const mimeType = audio.mimetype;
    const uploadResult = await fileManager.uploadFile(audio.path, {
      mimeType,
      displayName: audio.originalname,
    });
    const audioUrl = uploadResult.file.uri;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Convert voice inputs into text, allowing users to submit location reviews or footpath assessments via voice commands.",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: audioUrl,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("");
    console.log(result.response.text());

    res.status(200).send({
      audioUrl,
      transcription: result.response.text(),
    });
  } catch (error) {
    console.error('Error uploading audio or running Generative AI:', error);
    res.status(500).send({
      message: 'Error uploading audio or running Generative AI',
    });
  }
});

app.post('/generate', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).send({ error: 'Missing prompt in request body' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "\n### General Features:\n1. **User Authentication & Profile Management**:\n   - Users can **sign up**, **log in**, and **log out** securely.\n   - **Profile management** allows users to update personal details (username, email) and view past contributions (reviews, assessments).\n   - **Account deletion** functionality for users who want to permanently delete their profiles.\n\n2. **Location Data Management**:\n   - Users can **create**, **view**, **update**, and **delete locations**.\n   - A **map interface** displays all locations with options to search, filter, and view details like pollution, safety, and tourist attraction status.\n   - Admins can see a **map overview** with color-coded locations based on selected filters (e.g., pollution or safety).\n\n3. **Review Management**:\n   - Users can submit reviews for specific locations, including **ratings** and **review text**.\n   - Reviews can be updated or deleted by the author.\n   - The site also supports **voice input** for review submissions using Google Cloud Speech-to-Text.\n\n4. **Footpath Assessment**:\n   - Users can assess footpaths at specific locations by submitting **text feedback** or **image uploads**.\n   - An AI-generated assessment provides suggestions based on image analysis using Google Vision API.\n   - Users can update or delete their assessments.\n\n5. **AI Integration**:\n   - The system automatically generates **summaries and insights** from user reviews and footpath assessments.\n   - **AI-suggested assessments** based on historical data trends or image analysis.\n\n6. **Image Metadata Management**:\n   - Users can upload images related to locations, and metadata is extracted using Google Vision API (labels, objects, etc.).\n   - Images can be updated or deleted, and users can view metadata for a specific location.\n\n### Pages Overview:\n1. **Home Page**: \n   - Introduction to the platform's purpose (crowdsourced location data and reviews).\n   - Clear navigation to key sections like the **Location Map**, **Reviews**, **Dashboard**, and **Profile**.\n\n2. **Location Map Page**:\n   - Displays a **map with markers** for each location.\n   - Allows users to view detailed location information, including pollution, safety, and reviews.\n   - Options to **add new locations** or apply **filters** (pollution level, safety, etc.).\n\n3. **Review Page**:\n   - Users can **select locations** and submit reviews, view existing reviews, and use voice input.\n   - Includes **review management** (update/delete) options.\n\n4. **Footpath Assessment Page**:\n   - Users can assess footpaths by submitting **feedback or images**.\n   - Features **AI-generated assessments** and options to view/edit/delete past submissions.\n\n5. **Image Metadata Page**:\n   - Manage image uploads and metadata for each location.\n   - Users can view AI-detected labels for each image and manage (update/delete) the uploaded images.\n\n6. **Admin Dashboard**:\n   - Admins can **visualize data** through charts (e.g., pollution/safety ratings, number of reviews, footpath assessments).\n   - **Filters** for pollution, safety, cost of living, and more.\n   - Map overview for quick data visualization across locations.\n\n7. **User Profile Page**:\n   - Allows users to **manage their profiles**, view their contributions, and delete their accounts.\n\nour website  citysphere offers a comprehensive platform for users to interact with location-based data and manage their profiles. It allows users to securely sign up, log in, log out, and manage their profiles, including updating personal details and viewing past contributions like reviews and footpath assessments. Users can explore and manage locations using an interactive map that displays markers for various locations, showing detailed information such as pollution levels, safety ratings, and tourist attraction status. The map also supports filters for customizing the view. Users can submit, update, and delete reviews for specific locations, with support for both text and voice input. Additionally, footpath assessments can be submitted through text feedback or image uploads, with AI-generated insights assisting in the process. Image uploads are analyzed using Google Vision API, extracting relevant metadata like labels, and these images can be managed (updated or deleted) by the users. AI integration enhances the platform by generating summaries and providing insights based on user reviews, assessments, and image analysis. For administrators, a dedicated dashboard offers visualizations such as charts and graphs, tracking trends like pollution and safety across locations, along with filters for analyzing data. The platform’s user profile page allows for easy profile management, contribution tracking, and account deletion, ensuring a seamless user experience.\n\n\nif the user asks anything , take out info from this and provide him",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: prompt },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("");
    res.status(200).send({ response: result.response.text() });
  } catch (error) {
    console.error('Error running Generative AI:', error);
    res.status(500).send({ message: 'Error running Generative AI' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

