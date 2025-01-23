require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 9000;
const swaggerUi = require('swagger-ui-express');
// const swaggerDocs = require('./Utils/swagger');
const apiRouter = require('./Routes/routes'); // Assuming 'router.js' is in the 'routes' folder

// Middleware
app.use(bodyParser.json());
// Serve Swagger UI
const swaggerDocument = require('./Utils/swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const mongo_url = process.env.MONGO_URL;

console.log("Mongo URL:", mongo_url); // Add this line to debug

mongoose.connect(mongo_url);
console.log("Connected to database!");

//routes
app.use('/', apiRouter);


app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server Running on Port " + PORT);
    } else {
        console.log("Error :" + error)
    }
})