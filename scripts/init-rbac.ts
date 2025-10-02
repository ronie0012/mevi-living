#!/usr/bin/env tsx

import { initializeRBAC, assignRole } from '../src/lib/rbac';
import { db } from '../src/lib/db';
import { user } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🚀 Initializing RBAC system...');

  try {
    // Initialize roles, permissions, and role-permission mappings
    await initializeRBAC();
    
    // Assign admin role to first user if any exists
    const firstUser = await db.select({
      id: user.id,
      email: user.email,
      name: user.name
    }).from(user).limit(1);
    
    if (firstUser.length > 0) {
      const success = await assignRole(firstUser[0].id, 'admin');
      if (success) {
        console.log(`✅ Assigned admin role to user: ${firstUser[0].email}`);
      } else {
        console.log(`⚠️  Failed to assign admin role to user: ${firstUser[0].email}`);
      }
    } else {
      console.log('ℹ️  No users found. Admin role will be assigned automatically to the first registered user.');
    }

    console.log('✅ RBAC system initialized successfully!');
    console.log('\n📋 Summary:');
    console.log('- Roles: admin, moderator, user');
    console.log('- Permissions: read/write/delete for users, products, orders');
    console.log('- System permissions: manage roles/permissions, admin dashboard access');
    console.log('\n🔐 To access admin dashboard:');
    console.log('1. Register a new user account');
    console.log('2. Run: npm run init-rbac (to assign admin role to first user)');
    console.log('3. Visit: /admin/dashboard');
    
  } catch (error) {
    console.error('❌ Failed to initialize RBAC system:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export default main;