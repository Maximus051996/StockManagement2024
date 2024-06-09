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
        {
            name: 'Company-Module',
            description: 'Endpoints related to company information',
        },
        {
            name: 'Product-Module',
            description: 'Endpoints related to product information',
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
                                example: {
                                    userName: 'exampleUser',
                                    userPassword: 'examplePassword123',
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
        '/add-user': {
            post: {
                summary: 'Register a new user',
                tags: ['User-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    userName: { type: 'string' },
                                    roleId: { type: 'string' },
                                    phone: { type: 'string' },
                                    email: { type: 'string' },
                                    userPassword: { type: 'string' },
                                    address: { type: 'string' },
                                },
                                example: {
                                    firstName: 'new',
                                    lastName: 'User',
                                    userName: 'newUser',
                                    roleId: 'roleId123',
                                    phone: '1234567890',
                                    email: 'newuser@example.com',
                                    userPassword: 'newUserPassword123',
                                    address: '1234 Example St, Example City, EX 12345',
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'User registered successfully' },
                    400: { description: 'Username already exists' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        "/update-user/{id}": {
            "put": {
                "summary": "Update an existing user",
                "tags": ["User-Module"],
                "security": [{ "Bearer": [] }],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": { "type": "string" }
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userName": { "type": "string" },
                                    "roleId": { "type": "string" },
                                    "phone": { "type": "string" },
                                    "email": { "type": "string" },
                                    "address": { "type": "string" }
                                },
                                "example": {
                                    "userName": "updatedUser",
                                    "roleId": "updatedRoleId",
                                    "phone": "0987654321",
                                    "email": "updateduser@example.com",
                                    "address": "5678 Example St, Example City, EX 67890"
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": { "description": "User updated successfully" },
                    "404": { "description": "User not found" },
                    "500": { "description": "Internal server error" }
                }
            }
        },
        "/get-user-details": {
            "get": {
                "summary": "Retrieve all users",
                "tags": ["User-Module"],
                "security": [{ "Bearer": [] }],
                "responses": {
                    "200": { "description": "Users retrieved successfully" },
                    "500": { "description": "Internal server error" }
                }
            }
        },
        "/get-user-details-byId/{id}": {
            "get": {
                "summary": "Retrieve a user by ID",
                "tags": ["User-Module"],
                "security": [{ "Bearer": [] }],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": { "type": "string" }
                    }
                ],
                "responses": {
                    "200": { "description": "User retrieved successfully" },
                    "404": { "description": "User not found" },
                    "500": { "description": "Internal server error" }
                }
            }
        },
        "/delete-user/{id}": {
            "delete": {
                "summary": "Deactivate a user",
                "tags": ["User-Module"],
                "security": [{ "Bearer": [] }],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": { "type": "string" }
                    }
                ],
                "responses": {
                    "200": { "description": "User deactivated successfully" },
                    "404": { "description": "User not found" },
                    "500": { "description": "Internal server error" }
                }
            }
        },
        "/activate-user/{id}": {
            "get": {
                "summary": "Activate a user",
                "tags": ["User-Module"],
                "security": [{ "Bearer": [] }],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "schema": { "type": "string" }
                    }
                ],
                "responses": {
                    "200": { "description": "User activated successfully" },
                    "404": { "description": "User not found" },
                    "500": { "description": "Internal server error" }
                }
            }
        },
        '/send-mail': {
            post: {
                summary: 'Send an email to a user',
                tags: ['User-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    userName: { type: 'string' },
                                    touserMail: { type: 'string' },
                                    touserPassword: { type: 'string' },
                                    roleId: { type: 'string' }
                                },
                                example: {
                                    userName: 'exampleUser',
                                    touserMail: 'examplePassword123',
                                    touserPassword: 'exampleUser@example.com',
                                    roleId: 'R1',
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Email sent successfully' },
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
        '/ins-dashboard/all-productCount-totalQuantityDesc': {
            get: {
                summary: 'Get all companies with the highest total product quantities in decending order',
                tags: ['Ins-Dashboard'],
                security: [{ Bearer: [] }], // Requires Bearer token
                responses: {
                    200: { description: 'All companies with the highest total product quantities in decending order' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/companyRoutes/company-details': {
            get: {
                summary: 'Get company details',
                tags: ['Company-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                responses: {
                    200: { description: 'fetched successfully' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/companyRoutes/add-company': {
            post: {
                summary: 'Add company details',
                tags: ['Company-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    companyName: { type: 'string' }
                                },
                                example: {
                                    companyName: 'Example Company',
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Added successfully' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/companyRoutes/delete-company/{id}': {
            delete: {
                summary: 'Delete company details',
                tags: ['Company-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: { description: 'Company deleted successfully' },
                    404: { description: 'Company not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/companyRoutes/update-company/{id}': {
            put: {
                summary: 'Update company details',
                tags: ['Company-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    companyName: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Company updated successfully' },
                    404: { description: 'Company not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/companyRoutes/company-details/{id}': {
            get: {
                summary: 'Get company details by ID',
                tags: ['Company-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: { description: 'Company details fetched successfully' },
                    404: { description: 'Company not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/companyRoutes/import-companies': {
            post: {
                summary: 'Import multiple companies',
                tags: ['Company-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        companyName: { type: 'string' }
                                    },
                                    example: {
                                        companyName: 'Example Company',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Companies imported successfully' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        "/productRoutes/add-product": {
            "post": {
                "summary": "Add product details",
                "tags": ["Product-Module"],
                "security": [{ "Bearer": [] }], // Requires Bearer token
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "productName": {
                                        "type": "string",
                                        "example": "Product A"
                                    },
                                    "companyId": {
                                        "type": "string",
                                        "example": "C1"
                                    },
                                    "productDetails": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "selectedWarehouse": {
                                                    "type": "string",
                                                    "example": "Warehouse 1"
                                                },
                                                "mrp": {
                                                    "type": "number",
                                                    "example": 10.5
                                                },
                                                "defaultpercentage": {
                                                    "type": "number",
                                                    "example": 0.05
                                                },
                                                "quantity": {
                                                    "type": "number",
                                                    "example": 100
                                                },
                                                "dOExpiry": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "example": "2024-05-27T00:00:00Z"
                                                }
                                            }
                                        }
                                    },
                                    "totalQuantity": {
                                        "type": "number",
                                        "example": 500
                                    }
                                },
                                "required": ["productName", "companyId", "totalQuantity"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Added successfully"
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                }
            }
        },
        '/productRoutes/product-details': {
            get: {
                summary: 'Get product details',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                responses: {
                    200: { description: 'fetched successfully' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/delete-product/{id}': {
            delete: {
                summary: 'Delete product details',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: { description: 'Product deleted successfully' },
                    404: { description: 'Product not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        "/productRoutes/update-product/{id}": {
            "put": {
                "summary": "Update product details",
                "tags": ["Product-Module"],
                "security": [{ "Bearer": [] }], // Requires Bearer token
                "parameters": [
                    {
                        "in": "path",
                        "name": "id",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "productName": { "type": "string", example: 'Product A' },
                                    "companyId": { "type": "string", example: 'C1' },
                                    "productDetails": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "selectedWarehouse": { "type": "string", example: 'Upper Big Room' },
                                                "mrp": { "type": "number", example: 10.5 },
                                                "quantity": { "type": "number", example: 0.05 },
                                                "dOExpiry": { "type": "string", "format": "date-time", example: '2024-05-27T00:00:00Z' },
                                                "defaultpercentage": { "type": "number", example: 100 }
                                            },
                                        }
                                    },
                                    "totalQuantity": { "type": "number", example: 500 }
                                },
                                "required": ["productName", "companyId", "totalQuantity"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": { "description": "Product updated successfully" },
                    "404": { "description": "Product not found" },
                    "500": { "description": "Internal server error" }
                }
            }
        },
        '/productRoutes/product-details/{id}': {
            get: {
                summary: 'Get product details by ID',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: { description: 'Product details fetched successfully' },
                    404: { description: 'Product not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/product-details-companyId/{id}': {
            get: {
                summary: 'Get product details by company Id',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: { description: 'Product details fetched successfully' },
                    404: { description: 'Product not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/import-products': {
            post: {
                summary: 'Import multiple products',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        companyName: { type: 'string' },
                                        productName: { type: 'string' },
                                        mrp: { type: 'number' },
                                        quantity: { type: 'number' },
                                        defaultpercentage: { type: 'number' },
                                        dOExpiry: { type: 'string', format: 'date-time' },
                                        selectedWarehouse: { type: 'string' },
                                    },
                                    example: {
                                        companyName: 'Example Company',
                                        productName: 'Product A',
                                        mrp: 10.5,
                                        quantity: 100,
                                        defaultpercentage: 0.05,
                                        dOExpiry: '2024-06-10T00:00:00Z',
                                        selectedWarehouse: 'Warehouse 1',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Products imported successfully' },
                    400: { description: 'Bad request' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/add-damage-products': {
            post: {
                summary: 'Add damage products',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    productId: { type: 'string' },
                                    companyId: { type: 'string' },
                                    quantity: { type: 'number' },
                                    mrp: { type: 'number' },
                                    dOExpiry: { type: 'string', format: 'date-time' },
                                    isDeleted: { type: 'boolean' },
                                },
                                example: {
                                    productId: 'P123',
                                    companyId: 'C456',
                                    quantity: 100,
                                    mrp: 10.5,
                                    dOExpiry: '2024-06-10T00:00:00Z',
                                    isDeleted: false,
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Damage product added successfully' },
                    400: { description: 'Bad request' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/get-damage-products-details': {
            get: {
                summary: 'Get damage product details',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                responses: {
                    200: { description: 'Damage products fetched successfully' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/damage-products-byId/{id}': {
            get: {
                summary: 'Get damage product details by ID',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: { description: 'Damage product details fetched successfully' },
                    404: { description: 'Damage product not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/update-damage-product/{id}': {
            put: {
                summary: 'Update damage product details',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    quantity: { type: 'number' },
                                    mrp: { type: 'number' },
                                },
                                example: {
                                    quantity: 150,
                                    mrp: 9.75,
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Damage product updated successfully' },
                    404: { description: 'Damage product not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/delete-damage-products/{id}': {
            delete: {
                summary: 'Delete damage products',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: { description: 'Damage product deleted successfully' },
                    404: { description: 'Damage product not found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/productRoutes/import-damage-products': {
            post: {
                summary: 'Import multiple damage products',
                tags: ['Product-Module'],
                security: [{ Bearer: [] }], // Requires Bearer token
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        companyName: { type: 'string' },
                                        productName: { type: 'string' },
                                        quantity: { type: 'number' },
                                        mrp: { type: 'number' },
                                        dOExpiry: { type: 'string', format: 'date-time' },
                                    },
                                    example: {
                                        companyName: 'Example Company',
                                        productName: 'Product A',
                                        quantity: 100,
                                        mrp: 10.5,
                                        dOExpiry: '2024-06-10T00:00:00Z',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Products imported successfully' },
                    400: { description: 'Bad request' },
                    500: { description: 'Internal server error' },
                },
            },
        },

    },
};


const outputFile = './swagger-output.json';
const routes = ['./routes/userroute.js', './routes/ins-dashboard.js', './routes/companyroute.js', './routes/productroute.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);