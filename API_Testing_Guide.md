# Mevi Living API Testing Guide

## Overview
This guide helps you test all APIs in your Mevi Living website using the provided Postman collection.

## Setup Instructions

### 1. Import the Collection
1. Open Postman
2. Click "Import" 
3. Select the `postman-collection.json` file from your project root
4. The collection will be imported with all endpoints organized in folders

### 2. Environment Setup
The collection uses variables that are automatically managed:
- `baseUrl`: Set to `http://localhost:3000` (change if your server runs on different port)
- `authToken`: Automatically populated when you sign in
- `jwtToken`: Automatically populated when you generate JWT tokens

### 3. Start Your Development Server
Make sure your Next.js application is running:
```bash
npm run dev
# or
yarn dev
```

## Testing Workflow

### Phase 1: Authentication Testing
1. **Sign In as Admin**
   - Run "Authentication > Sign In - Admin"
   - This will automatically save the auth token for subsequent requests
   - Test credentials: `admin@localhost.com` / `admin123`

2. **Sign In as Regular User** 
   - Run "Authentication > Sign In - Regular User"
   - Test credentials: `user@localhost.com` / `user123`

3. **Token Verification**
   - Test both POST and GET methods for token verification
   - Verify tokens work correctly

### Phase 2: JWT Token Testing
1. **Generate JWT Token**
   - Run "JWT Testing > Generate JWT Token" (requires auth token)
   - This saves a separate JWT token for API testing

2. **Verify JWT Token**
   - Test the generated JWT token verification

### Phase 3: Admin Functionality Testing
**Note: Must be signed in as admin user first**

1. **User Management**
   - Get all users
   - Assign roles to users
   - Remove roles from users

2. **Roles & Permissions**
   - Get all roles with user counts
   - Get all permissions

### Phase 4: Chat System Testing
1. **Product Inquiries**
   - Test different chat scenarios:
     - Order tracking with order numbers
     - Product recommendations
     - Specific product questions (Windsor Bloom, Alba Trayette)
     - Pricing inquiries
     - Shipping information

2. **Sample Chat Messages to Test**:
   - `"Hello, I need help with my order #ORD-123456-ABCD"`
   - `"Tell me about your serveware collection"`
   - `"What can you tell me about Windsor Bloom plates?"`
   - `"How much does the Alba Trayette cost?"`
   - `"What are your shipping options?"`

### Phase 5: Error Testing
Test error handling and validation:
1. **Unauthorized Access** - Try admin endpoints without auth
2. **Invalid Tokens** - Test with invalid JWT tokens  
3. **Invalid Credentials** - Try wrong login credentials
4. **Missing Fields** - Test requests with missing required fields
5. **Invalid Data** - Test with invalid role names, etc.

## API Endpoints Summary

### Authentication APIs
- `POST /api/auth/sign-in` - Sign in with email/password
- `GET /api/auth/sign-in` - Get sign-in endpoint info
- `POST /api/auth/verify-token` - Verify token (body)
- `GET /api/auth/verify-token` - Verify token (header)
- `GET|POST /api/auth/*` - Auth handler (catch-all)

### JWT Testing APIs  
- `POST /api/test-jwt` - Generate JWT token (requires auth)
- `GET /api/test-jwt` - Verify JWT token

### Admin APIs (Admin Only)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/assign-role` - Assign role to user
- `POST /api/admin/remove-role` - Remove role from user
- `GET /api/admin/roles` - Get all roles
- `GET /api/admin/permissions` - Get all permissions

### Chat API
- `POST /api/chat/send` - Send chat message and get AI response

## Test Credentials

### Admin User
- **Email**: `admin@localhost.com`
- **Password**: `admin123`
- **User ID**: `user_123`
- **Role**: `admin`

### Regular User  
- **Email**: `user@localhost.com`
- **Password**: `user123`
- **User ID**: `user_456`
- **Role**: `user`

## Expected Response Formats

### Successful Authentication
```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_123",
    "email": "admin@localhost.com", 
    "role": "admin"
  }
}
```

### Chat Response
```json
{
  "response": {
    "id": "uuid",
    "sessionId": "session_12345",
    "senderType": "bot",
    "message": "AI response here",
    "messageType": "text",
    "isRead": false,
    "sentAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Tips for Testing

1. **Authentication Flow**: Always start by signing in to get auth tokens
2. **Token Management**: The collection automatically manages tokens between requests
3. **Admin Testing**: Use admin account to test admin-only endpoints
4. **Error Cases**: Test both success and error scenarios
5. **Chat Testing**: Try various message types to test AI responses
6. **Status Codes**: Pay attention to HTTP status codes (200, 401, 403, 400, 500)

## Troubleshooting

### Common Issues
1. **401 Unauthorized**: Make sure you're signed in and token is valid
2. **403 Forbidden**: Admin endpoints require admin role
3. **400 Bad Request**: Check required fields in request body
4. **500 Internal Server Error**: Check server logs for issues

### Debug Tips
1. Check Postman Console for request/response details
2. Verify environment variables are set correctly
3. Ensure your development server is running
4. Check server logs for error details

## Collection Features

- **Automatic Token Management**: Auth tokens are automatically saved and used
- **Environment Variables**: Dynamic baseUrl and token management
- **Test Scripts**: Automatic token extraction and storage
- **Error Testing**: Comprehensive error scenario coverage
- **Documentation**: Each request includes detailed descriptions

Happy Testing! 🚀