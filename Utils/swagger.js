const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Foodie Management API',
        description: 'API documentation for managing Foodie Project',
        version: '1.0.0',
    },
    host: 'localhost:9000', // Adjust this as per your server URL
    schemes: ['http'],
};

const outputFile = './swagger-output.json'; // Output file
const endpointsFiles = ['../Routes/routes.js']; // Path to your routes file(s)

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    // Start your server after generating the documentation
    require('../app.js'); // Replace with the entry point of your application
});
