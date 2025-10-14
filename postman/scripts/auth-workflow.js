// Authentication Workflow Scripts for Mevi Living API

// ================================
// PRE-REQUEST SCRIPTS
// ================================

/**
 * Auto-refresh JWT Token
 * Add this to pre-request script of endpoints that require JWT authentication
 */
function autoRefreshJWT() {
    const jwtToken = pm.environment.get('jwt_token');
    const tokenTimestamp = pm.environment.get('jwt_token_timestamp');
    const now = Date.now();
    const tokenAge = now - parseInt(tokenTimestamp || '0');
    
    // Refresh token if it's older than 20 hours (token expires in 24h)
    if (!jwtToken || tokenAge > (20 * 60 * 60 * 1000)) {
        console.log('JWT token needs refresh...');
        
        // Make request to generate new JWT token
        pm.sendRequest({
            url: pm.environment.get('base_url') + '/api/test-jwt',
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }
        }, function (err, response) {
            if (err) {
                console.log('Failed to refresh JWT token:', err);
                return;
            }
            
            const responseJson = response.json();
            if (responseJson.success && responseJson.token) {
                pm.environment.set('jwt_token', responseJson.token);
                pm.environment.set('jwt_token_timestamp', Date.now().toString());
                console.log('JWT token refreshed successfully');
            } else {
                console.log('Failed to refresh JWT token:', responseJson);
            }
        });
    }
}

/**
 * Set Dynamic Request ID
 * Adds unique request ID to track API calls
 */
function setRequestId() {
    const requestId = pm.variables.replaceIn('{{$guid}}');
    pm.request.headers.add({
        key: 'X-Request-ID',
        value: requestId
    });
    pm.environment.set('last_request_id', requestId);
}

/**
 * Set Timestamp Headers
 * Adds timestamp headers for request tracking
 */
function setTimestampHeaders() {
    const timestamp = Date.now();
    pm.request.headers.add({
        key: 'X-Timestamp',
        value: timestamp.toString()
    });
    pm.environment.set('request_timestamp', timestamp.toString());
}

// ================================
// POST-RESPONSE TEST SCRIPTS
// ================================

/**
 * Save Authentication Token from Response
 * Use this in test scripts for authentication endpoints
 */
function saveAuthTokenFromResponse() {
    if (pm.response.code === 200) {
        const responseJson = pm.response.json();
        
        // Save JWT token if present
        if (responseJson.token) {
            pm.environment.set('jwt_token', responseJson.token);
            pm.environment.set('jwt_token_timestamp', Date.now().toString());
            console.log('JWT token saved to environment');
        }
        
        // Save user information if present
        if (responseJson.user) {
            pm.environment.set('current_user_id', responseJson.user.id);
            pm.environment.set('current_user_email', responseJson.user.email);
            pm.environment.set('current_user_role', responseJson.user.role);
            console.log('User information saved to environment');
        }
        
        // Save session information if present
        if (responseJson.sessionId) {
            pm.environment.set('session_id', responseJson.sessionId);
            console.log('Session ID saved to environment');
        }
    }
}

/**
 * Extract User IDs from Users List
 * Use this in test scripts for endpoints that return user lists
 */
function extractUserIds() {
    if (pm.response.code === 200) {
        const responseJson = pm.response.json();
        
        if (responseJson.users && Array.isArray(responseJson.users)) {
            const users = responseJson.users;
            
            if (users.length > 0) {
                // Save first user ID as test user
                pm.environment.set('test_user_id', users[0].id);
                
                // Find and save admin user ID
                const adminUser = users.find(user => 
                    user.roles && user.roles.some(role => role.name === 'admin')
                );
                if (adminUser) {
                    pm.environment.set('admin_user_id', adminUser.id);
                }
                
                // Find and save regular user ID
                const regularUser = users.find(user => 
                    user.roles && user.roles.some(role => role.name === 'user')
                );
                if (regularUser) {
                    pm.environment.set('regular_user_id', regularUser.id);
                }
                
                console.log('User IDs extracted and saved to environment');
            }
        }
    }
}

/**
 * Common API Response Tests
 * Standard tests to include in all API endpoints
 */
function runCommonAPITests() {
    // Test response time
    pm.test('Response time is acceptable', function () {
        pm.expect(pm.response.responseTime).to.be.below(5000);
    });
    
    // Test content type
    pm.test('Content-Type header is present', function () {
        pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
    });
    
    // Test for security headers (if implemented)
    pm.test('Security headers are present', function () {
        // These are optional but recommended
        const securityHeaders = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection'
        ];
        
        // Just log if they're missing (not fail the test)
        securityHeaders.forEach(header => {
            if (!pm.response.headers.get(header)) {
                console.log(`Security header missing: ${header}`);
            }
        });
    });
}

/**
 * Test Error Responses
 * Standard tests for error scenarios
 */
function testErrorResponse(expectedStatusCode) {
    pm.test(`Status code is ${expectedStatusCode}`, function () {
        pm.response.to.have.status(expectedStatusCode);
    });
    
    pm.test('Error response has error message', function () {
        const responseJson = pm.response.json();
        pm.expect(responseJson).to.have.property('error');
        pm.expect(responseJson.error).to.be.a('string');
        pm.expect(responseJson.error.length).to.be.above(0);
    });
    
    // Log the error for debugging
    if (pm.response.code >= 400) {
        console.log('API Error Response:', pm.response.json());
    }
}

/**
 * Test Success Responses
 * Standard tests for successful API responses
 */
function testSuccessResponse(expectedProperties = []) {
    pm.test('Status code is 200', function () {
        pm.response.to.have.status(200);
    });
    
    pm.test('Response has success flag', function () {
        const responseJson = pm.response.json();
        pm.expect(responseJson.success).to.be.true;
    });
    
    // Test for expected properties
    if (expectedProperties.length > 0) {
        pm.test('Response has expected properties', function () {
            const responseJson = pm.response.json();
            expectedProperties.forEach(property => {
                pm.expect(responseJson).to.have.property(property);
            });
        });
    }
}

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Generate Test Data
 * Creates random test data for API calls
 */
function generateTestData() {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    
    return {
        testEmail: `test${randomId}@example.com`,
        testName: `Test User ${randomId}`,
        testRole: 'user',
        timestamp: timestamp.toString(),
        requestId: pm.variables.replaceIn('{{$guid}}')
    };
}

/**
 * Validate JWT Token Structure
 * Checks if JWT token has valid structure
 */
function validateJWTStructure(token) {
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
        // Try to decode header and payload (not verifying signature)
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        
        // Basic JWT structure validation
        return header.typ === 'JWT' && header.alg && payload.exp;
    } catch (e) {
        return false;
    }
}

// ================================
// EXAMPLE USAGE IN POSTMAN
// ================================

/*
PRE-REQUEST SCRIPT EXAMPLE:
```
// Auto-refresh JWT token before admin requests
autoRefreshJWT();

// Set request tracking headers
setRequestId();
setTimestampHeaders();
```

TEST SCRIPT EXAMPLE:
```
// Run common API tests
runCommonAPITests();

// Test successful response with expected properties
testSuccessResponse(['users', 'stats']);

// Save authentication data if present
saveAuthTokenFromResponse();

// Extract user IDs for future tests
extractUserIds();
```

ERROR TESTING EXAMPLE:
```
// Test unauthorized access
testErrorResponse(401);
```
*/