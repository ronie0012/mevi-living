# Complete Authentication & Authorization System

This project now includes a comprehensive authentication system with JWT tokens and role-based access control (RBAC). Here's everything you need to know:

## 🔑 Features

### ✅ Authentication
- **Better Auth Integration**: Secure email/password authentication
- **JWT Token Support**: API authentication with JWT tokens
- **Social Login Ready**: Google and GitHub OAuth (requires API keys)
- **Session Management**: Secure session handling with automatic expiration
- **Password Security**: Encrypted password storage with bcrypt
- **Rate Limiting**: API rate limiting to prevent abuse

### ✅ Authorization (RBAC)
- **Role-Based Access Control**: Admin, Moderator, and User roles
- **Granular Permissions**: Resource-based permissions (users, products, orders)
- **Dynamic Role Assignment**: Admin can assign/remove roles from users
- **Permission Checking**: Middleware and utility functions for access control
- **Protected Routes**: Different access levels for different parts of the application

### ✅ Security Features
- **JWT Secrets**: Proper JWT secret management
- **Security Headers**: CSP, XSS protection, frame options
- **Input Validation**: Zod-based form validation
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: Request rate limiting for API endpoints

## 🗄️ Database Schema

### Core Auth Tables
- **user**: User accounts with email verification and roles
- **session**: User sessions with expiration and device tracking
- **account**: OAuth accounts and password storage
- **verification**: Email verification tokens

### RBAC Tables
- **roles**: System roles (admin, moderator, user)
- **permissions**: Granular permissions for resources
- **role_permissions**: Role to permission mappings
- **user_roles**: User to role assignments (supports multiple roles)

## 🚀 Getting Started

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Update with your values
BETTER_AUTH_SECRET="your-very-secure-secret-key-here"
JWT_SECRET="your-jwt-secret-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Database Setup
```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Initialize RBAC system (roles, permissions)
npm run init-rbac
```

### 3. Create First Admin User
1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/register`
3. Create your first user account
4. Run `npm run init-rbac` again to assign admin role to the first user
5. Visit `http://localhost:3000/admin/dashboard` to access admin panel

## 🛡️ Role System

### Roles
- **admin**: Full system access, can manage users and roles
- **moderator**: Can manage products and orders
- **user**: Basic access to view products and own orders

### Permissions
- **User Management**: `read:users`, `write:users`, `delete:users`
- **Product Management**: `read:products`, `write:products`, `delete:products`
- **Order Management**: `read:orders`, `write:orders`, `delete:orders`
- **System Management**: `manage:roles`, `manage:permissions`, `admin:dashboard`

## 🔒 Protected Routes

### Frontend Routes
- `/account` - Requires authentication
- `/admin/*` - Requires admin role
- `/admin/dashboard` - Admin dashboard with user management

### API Routes
- `/api/admin/*` - Requires admin role and permissions
- `/api/admin/users` - User management API
- `/api/admin/roles` - Role management API
- `/api/admin/assign-role` - Role assignment API

## 🧩 Usage Examples

### Check User Permissions
```typescript
import { hasPermission, hasRole } from '@/lib/rbac';

// Check if user has specific permission
const canDeleteUsers = await hasPermission(userId, 'delete:users');

// Check if user has specific role
const isAdmin = await hasRole(userId, 'admin');
```

### Protect API Routes
```typescript
import { apiMiddleware } from '@/lib/middleware-helpers';

export async function GET(request: NextRequest) {
  const auth = await apiMiddleware(request, ['admin:dashboard']);
  
  if ('error' in auth) {
    return auth; // Returns error response
  }
  
  // User is authenticated and has required permissions
  const { user, session } = auth;
  // ... your API logic
}
```

### Generate JWT Tokens
```typescript
import { generateJWT } from '@/lib/auth';

// Generate API token
const token = generateJWT({
  userId: user.id,
  roles: ['admin'],
  type: 'api_token'
}, '24h');
```

### Role-Based UI Components
```tsx
'use client';
import { useSession } from '@/lib/auth-client';
import { hasRole } from '@/lib/rbac';
import { useEffect, useState } from 'react';

export function AdminPanel() {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user) {
      hasRole(session.user.id, 'admin').then(setIsAdmin);
    }
  }, [session]);

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return <div>Admin content here</div>;
}
```

## 🛠️ Development Scripts

```bash
# Database operations
npm run db:generate    # Generate migration files
npm run db:migrate     # Run database migrations
npm run db:studio      # Open Drizzle Studio
npm run init-rbac      # Initialize RBAC system

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run lint          # Run ESLint
```

## 📁 File Structure

```
src/
├── lib/
│   ├── auth.ts              # Better Auth configuration
│   ├── auth-client.ts       # Client-side auth utilities
│   ├── rbac.ts              # Role-based access control
│   ├── middleware-helpers.ts # Middleware utilities
│   └── db.ts                # Database connection
├── db/
│   └── schema.ts            # Database schema
├── app/
│   ├── api/
│   │   ├── auth/            # Auth API routes
│   │   └── admin/           # Admin API routes
│   ├── admin/
│   │   └── dashboard/       # Admin dashboard
│   ├── sign-in/             # Sign in page
│   ├── register/            # Registration page
│   └── account/             # User account page
├── middleware.ts            # Next.js middleware
└── scripts/
    └── init-rbac.ts         # RBAC initialization script
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit secrets to version control
2. **JWT Secrets**: Use long, random strings for JWT secrets
3. **Rate Limiting**: Implemented for API routes
4. **Input Validation**: All forms use Zod validation
5. **Password Security**: Passwords are hashed with bcrypt
6. **Session Security**: Sessions expire and include device tracking
7. **CSRF Protection**: Built into Better Auth
8. **Security Headers**: CSP, XSS protection, and more

## 🚨 Common Issues & Solutions

### Database Migration Issues
If you encounter migration issues:
```bash
# Reset database (development only)
rm local.db
rm drizzle/*.sql
rm drizzle/meta/*
echo '{"version":"6","dialect":"sqlite","entries":[]}' > drizzle/meta/_journal.json
npm run db:generate
npm run db:migrate
npm run init-rbac
```

### Authentication Errors
- Check environment variables are set correctly
- Ensure database migrations have been run
- Verify JWT secrets are configured
- Check that RBAC system is initialized

### Permission Denied
- Ensure user has required role/permission
- Check middleware configuration
- Verify database contains role assignments
- Run `npm run init-rbac` to reset RBAC system

## 🔄 Next Steps

1. **Email Verification**: Enable email verification in production
2. **OAuth Setup**: Configure Google/GitHub OAuth for social login
3. **Role Management UI**: Add interface for creating custom roles
4. **Audit Logging**: Track user actions for security
5. **Two-Factor Auth**: Add 2FA support
6. **Password Reset**: Implement password reset flow

---

## 📞 Support

If you encounter any issues with the authentication system:
1. Check this documentation
2. Review the console logs for errors
3. Ensure all dependencies are installed
4. Verify environment variables are set
5. Check database schema is up to date

The system is production-ready with proper security measures, but remember to:
- Use strong secrets in production
- Enable HTTPS
- Configure proper CORS settings
- Set up monitoring and logging
- Regular security updates