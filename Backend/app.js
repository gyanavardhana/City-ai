require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const footpathRoutes = require('./routes/footpathRoutes');
const filterRoutes = require('./routes/filterRoutes');
const imagemetaRoutes = require('./routes/imagemetaRoutes');

app.use(express.json());
app.use('/users', userRoutes);
app.use('/maps', locationRoutes);
app.use('/opinions', reviewRoutes);
app.use('/assessments', footpathRoutes);
app.use('/categories',  filterRoutes);
app.use('/images', imagemetaRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});