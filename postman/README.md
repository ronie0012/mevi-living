# Mevi Living API Testing with Postman

This directory contains everything you need to test your Mevi Living APIs using Postman, including collections, environments, and helper scripts.

## 📁 Directory Structure

```
postman/
├── README.md                           # This file
├── mevi-living-api-collection.json     # Main Postman collection
├── environments/
│   ├── development.postman_environment.json    # Development environment
│   └── production.postman_environment.json     # Production environment
└── scripts/
    └── auth-workflow.js                # Authentication helper scripts
```

## 🚀 Quick Start

### 1. Install Postman
- Download from [postman.com](https://www.postman.com/downloads/)
- Install the desktop application or use the web version

### 2. Import Collection and Environment

#### Import the API Collection:
1. Open Postman
2. Click "Import" button (top left)
3. Select `mevi-living-api-collection.json`
4. Click "Import"

#### Import Environment:
1. Click "Import" again
2. Select the environment file you want:
   - `environments/development.postman_environment.json` for local testing
   - `environments/production.postman_environment.json` for production testing
3. Click "Import"

### 3. Select Environment
1. In the top-right corner, select the environment you imported
2. Make sure it shows "Development Environment" or "Production Environment"

### 4. Start Your Development Server
Make sure your Next.js application is running:

```bash
npm run dev
```

Your API should be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Update these variables in your selected environment:

#### Required Variables:
- `base_url`: Your API base URL (default: `http://localhost:3000`)
- `test_email`: Email for testing authentication
- `test_password`: Password for testing authentication

#### Auto-populated Variables:
These will be automatically set by the test scripts:
- `jwt_token`: JWT authentication token
- `auth_token`: Session authentication token
- `test_user_id`: ID of a test user
- `admin_user_id`: ID of an admin user
- `current_user_id`: ID of the currently authenticated user

### Setting Up Test Credentials

Before testing, you'll need to set up test credentials:

1. **Start your application and database**
2. **Create a test admin user** (if not already exists)
3. **Update environment variables** with valid credentials:
   - Set `test_email` to a valid admin email
   - Set `test_password` to the corresponding password

## 📋 API Endpoints Overview

### Authentication Endpoints
- **Auth Handler (GET/POST)**: `/api/auth/[...all]`
- **Verify Token**: `/api/auth/verify-token`

### JWT Testing Endpoints
- **Generate JWT Token**: `POST /api/test-jwt`
- **Verify JWT Token**: `GET /api/test-jwt`

### Admin Endpoints (Require Admin Access)
- **Get All Users**: `GET /api/admin/users`
- **Get All Roles**: `GET /api/admin/roles`
- **Assign Role**: `POST /api/admin/assign-role`
- **Remove Role**: `POST /api/admin/remove-role`
- **Check Admin Access**: `GET /api/admin/check-access`
- **Get Admin Stats**: `GET /api/admin/stats`
- **Get Permissions**: `GET /api/admin/permissions`

## 🧪 Testing Workflows

### Basic Testing Workflow

1. **Authentication Flow**:
   ```
   1. Auth Handler (POST) → Get session/cookies
   2. Generate JWT Token → Get JWT for API calls
   3. Verify JWT Token → Confirm token validity
   ```

2. **Admin Operations Flow**:
   ```
   1. Get All Users → List all users, extract user IDs
   2. Get All Roles → List available roles
   3. Assign Role → Assign role to user
   4. Get Admin Stats → Verify system statistics
   5. Remove Role → Clean up test data
   ```

3. **Error Testing Flow**:
   ```
   1. Test Unauthorized Access → Try admin endpoint without auth
   2. Test Invalid Role Assignment → Try assigning invalid role
   ```

### Automated Testing Features

The collection includes several automated features:

#### 🔄 Auto-Token Management
- JWT tokens are automatically refreshed when expired
- Session tokens are managed automatically
- User IDs are extracted and stored for future requests

#### 🧪 Comprehensive Test Scripts
Each endpoint includes tests for:
- Response status codes
- Response structure validation
- Performance (response time)
- Security headers
- Data integrity
- Error handling

#### 📊 Test Results
After running tests, you'll see:
- ✅ Passed tests in green
- ❌ Failed tests in red
- 📝 Console logs with debugging information

## 🎯 Running Tests

### Individual Request Testing
1. Select any request from the collection
2. Click "Send"
3. View results in the response panel
4. Check test results in the "Test Results" tab

### Collection Testing (Run All Tests)
1. Click on the collection name "Mevi Living API Collection"
2. Click "Run" button
3. Select environment and configure options
4. Click "Start Run"
5. Monitor the test execution progress

### Automated Testing with Newman (CLI)
For CI/CD integration, use Newman:

```bash
# Install Newman
npm install -g newman

# Run collection
newman run postman/mevi-living-api-collection.json \
  -e postman/environments/development.postman_environment.json \
  --reporters html,json \
  --reporter-html-export test-results.html
```

## 🛠 Troubleshooting

### Common Issues and Solutions

#### 1. **Authentication Fails**
```
Error: "Authentication required"
```
**Solutions:**
- Verify your `test_email` and `test_password` in environment
- Ensure your database has a user with these credentials
- Check that your auth system is working locally
- Run the seed script: `npm run db:seed`

#### 2. **JWT Token Issues**
```
Error: "Invalid or expired token"
```
**Solutions:**
- The JWT token auto-refresh should handle this
- Manually run "Generate JWT Token" request
- Check that your JWT secret is configured in your app

#### 3. **Admin Access Denied**
```
Error: "Admin access required"
```
**Solutions:**
- Ensure your test user has admin role
- Run the RBAC initialization script: `npm run init-rbac`
- Check user roles in your database

#### 4. **Database Connection Issues**
```
Error: "Failed to fetch users" or similar database errors
```
**Solutions:**
- Ensure your database is running
- Check database connection in your app
- Run database migrations: `npm run db:migrate`

#### 5. **CORS Issues**
```
Error: "Access-Control-Allow-Origin"
```
**Solutions:**
- This should only happen if testing across domains
- Check your Next.js CORS configuration
- Use the development environment for local testing

### Debugging Tips

1. **Check Console Logs**:
   - Open Postman Console (View → Show Postman Console)
   - Review request/response details and custom logs

2. **Verify Environment Variables**:
   - Click the eye icon next to environment dropdown
   - Ensure all required variables are set

3. **Test Individual Endpoints**:
   - Start with simple endpoints like "Get Admin Stats"
   - Gradually test more complex flows

4. **Check Your API Server**:
   - Ensure your Next.js app is running (`npm run dev`)
   - Check server logs for errors
   - Test endpoints directly in browser (GET requests)

## 🔒 Security Best Practices

### Token Management
- JWT tokens are stored as environment variables (not in collection)
- Tokens are automatically refreshed to prevent expiration
- Use different credentials for different environments

### Environment Separation
- Never use production credentials in development environment
- Keep production passwords secure and separate
- Use environment-specific base URLs

### Data Privacy
- Test data should be non-sensitive
- Clean up test data after testing
- Don't commit real credentials to version control

## 📈 Advanced Usage

### Custom Scripts
You can add custom pre-request and test scripts using the helper functions in `scripts/auth-workflow.js`:

```javascript
// Pre-request script example
autoRefreshJWT();
setRequestId();

// Test script example
runCommonAPITests();
testSuccessResponse(['users', 'roles']);
extractUserIds();
```

### Data-Driven Testing
1. Create a CSV file with test data
2. Use Postman's data file feature when running collections
3. Reference data using `{{column_name}}` syntax

### Monitoring and Alerts
1. Set up Postman Monitors for automated testing
2. Configure alerts for test failures
3. Schedule regular API health checks

## 🤝 Contributing

To add new endpoints or modify tests:

1. **Add New Endpoints**:
   - Add request to appropriate folder in collection
   - Include proper headers and authentication
   - Add comprehensive test scripts

2. **Update Environment Variables**:
   - Add new variables to both environment files
   - Document the purpose of each variable

3. **Extend Helper Scripts**:
   - Add new functions to `scripts/auth-workflow.js`
   - Document usage examples
   - Test thoroughly before committing

## 📝 API Documentation

Your API endpoints follow this structure:

### Request Format
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{jwt_token}}" // for protected endpoints
}
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error message description",
  "code": 400
}
```

## 🎉 Getting Help

If you encounter issues:

1. **Check this README** for common solutions
2. **Review Postman Console** for detailed error information
3. **Test your API directly** using browser or curl
4. **Check your application logs** for server-side errors
5. **Verify database connectivity** and data consistency

Happy testing! 🚀