const swaggerAutogen = require('swagger-autogen')();


const doc = {
    info: {
        title: 'Stock Management API',
        description: 'Stock Management Documentation V1.0.0',
    },
    host: 'localhost:3000',
    tags: [
        {
            name: 'User-Module',
            description: 'Endpoints related to user modules information',
        },
        {
            name: 'Ins-Dashboard',
            description: 'Endpoints related to instructor dashboard information',
        },
    ],
    paths: {
        '/login': {
            post: {
                summary: 'Login as a user',
                tags: ['User-Module'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    userName: { type: 'string' },
                                    userPassword: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'User logged in successfully' },
                    401: { description: 'Invalid credentials' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/register': {
            post: {
                summary: 'Register a new user',
                tags: ['User-Module'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    userName: { type: 'string' },
                                    roleId: { type: 'string' },
                                    phone: { type: 'string' },
                                    email: { type: 'string' },
                                    userPassword: { type: 'string' },
                                    address: { type: 'string' },
                                    companyAssigned: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'User registered successfully' },
                    400: { description: 'Username already exists' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/ins-dashboard/total-company-count': {
            get: {
                summary: 'Get total count of active and inactive companies',
                tags: ['Ins-Dashboard'],
                security: [{ Bearer: [] }], // Requires Bearer token
                responses: {
                    200: { description: 'Total count of active and inactive companies' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/ins-dashboard/active-user-count': {
            get: {
                summary: 'Get total count of active users',
                tags: ['Ins-Dashboard'],
                security: [{ Bearer: [] }], // Requires Bearer token
                responses: {
                    200: { description: 'Total count of active users' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/ins-dashboard/damage-product-count': {
            get: {
                summary: 'Get total count of damaged products',
                tags: ['Ins-Dashboard'],
                security: [{ Bearer: [] }], // Requires Bearer token
                responses: {
                    200: { description: 'Total count of damaged products' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/ins-dashboard/top-five-productCountAsc-list': {
            get: {
                summary: 'Get top five companies with the highest total product quantities in ascending order',
                tags: ['Ins-Dashboard'],
                security: [{ Bearer: [] }], // Requires Bearer token
                responses: {
                    200: { description: 'Top five companies with the highest total product quantities in ascending order' },
                    500: { description: 'Internal server error' },
                },
            },
        },
    },
};


const outputFile = './swagger-output.json';
const routes = ['./routes/userroute.js', './routes/ins-dashboard'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);