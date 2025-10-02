import { db } from "./db";
import { user, roles, permissions, userRoles, rolePermissions } from "./schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

// Define role types
export type UserRole = 'admin' | 'moderator' | 'user';
export type Permission = 'read:users' | 'write:users' | 'delete:users' | 
                        'read:products' | 'write:products' | 'delete:products' |
                        'read:orders' | 'write:orders' | 'delete:orders' |
                        'manage:roles' | 'manage:permissions' | 'admin:dashboard';

// Permission definitions by role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'read:users', 'write:users', 'delete:users',
    'read:products', 'write:products', 'delete:products',
    'read:orders', 'write:orders', 'delete:orders',
    'manage:roles', 'manage:permissions', 'admin:dashboard'
  ],
  moderator: [
    'read:users', 'read:products', 'write:products',
    'read:orders', 'write:orders'
  ],
  user: [
    'read:products', 'read:orders'
  ]
};

// Default roles to seed in database
export const DEFAULT_ROLES = [
  {
    id: 'admin_role',
    name: 'admin',
    description: 'Full administrative access to all resources'
  },
  {
    id: 'moderator_role',
    name: 'moderator',
    description: 'Moderate access to manage products and orders'
  },
  {
    id: 'user_default',
    name: 'user',
    description: 'Basic user access to view products and own orders'
  }
];

// Default permissions to seed in database
export const DEFAULT_PERMISSIONS = [
  // User permissions
  { id: 'perm_read_users', name: 'read:users', description: 'Read user information', resource: 'users', action: 'read' },
  { id: 'perm_write_users', name: 'write:users', description: 'Create and update users', resource: 'users', action: 'write' },
  { id: 'perm_delete_users', name: 'delete:users', description: 'Delete users', resource: 'users', action: 'delete' },
  
  // Product permissions
  { id: 'perm_read_products', name: 'read:products', description: 'View products', resource: 'products', action: 'read' },
  { id: 'perm_write_products', name: 'write:products', description: 'Create and update products', resource: 'products', action: 'write' },
  { id: 'perm_delete_products', name: 'delete:products', description: 'Delete products', resource: 'products', action: 'delete' },
  
  // Order permissions
  { id: 'perm_read_orders', name: 'read:orders', description: 'View orders', resource: 'orders', action: 'read' },
  { id: 'perm_write_orders', name: 'write:orders', description: 'Create and update orders', resource: 'orders', action: 'write' },
  { id: 'perm_delete_orders', name: 'delete:orders', description: 'Delete orders', resource: 'orders', action: 'delete' },
  
  // System permissions
  { id: 'perm_manage_roles', name: 'manage:roles', description: 'Manage user roles', resource: 'system', action: 'manage_roles' },
  { id: 'perm_manage_permissions', name: 'manage:permissions', description: 'Manage permissions', resource: 'system', action: 'manage_permissions' },
  { id: 'perm_admin_dashboard', name: 'admin:dashboard', description: 'Access admin dashboard', resource: 'system', action: 'admin_access' }
];

// Utility functions
export async function getUserRoles(userId: string): Promise<string[]> {
  try {
    const userRoleData = await db
      .select({ roleName: roles.name })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));
    
    return userRoleData.map(r => r.roleName).filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
}

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  try {
    const userPermissions = await db
      .select({ permissionName: permissions.name })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(userRoles.userId, userId));
    
    return userPermissions.map(p => p.permissionName).filter(Boolean) as Permission[];
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}

export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissions(userId);
    return userPermissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

export async function hasRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    const userRolesList = await getUserRoles(userId);
    return userRolesList.includes(role);
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, 'admin');
}

export async function assignRole(userId: string, roleName: UserRole): Promise<boolean> {
  try {
    // Find the role ID
    const roleData = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1);
    if (roleData.length === 0) {
      console.error(`Role ${roleName} not found`);
      return false;
    }

    // Check if user already has this role
    const existingRole = await db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleData[0].id)))
      .limit(1);

    if (existingRole.length > 0) {
      return true; // Role already assigned
    }

    // Assign the role
    await db.insert(userRoles).values({
      id: nanoid(),
      userId,
      roleId: roleData[0].id,
    });

    return true;
  } catch (error) {
    console.error('Error assigning role:', error);
    return false;
  }
}

export async function removeRole(userId: string, roleName: UserRole): Promise<boolean> {
  try {
    // Find the role ID
    const roleData = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1);
    if (roleData.length === 0) {
      return false;
    }

    // Remove the role assignment
    await db
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleData[0].id)));

    return true;
  } catch (error) {
    console.error('Error removing role:', error);
    return false;
  }
}

// Database seeding functions
export async function seedRoles(): Promise<void> {
  try {
    for (const role of DEFAULT_ROLES) {
      const existingRole = await db.select().from(roles).where(eq(roles.id, role.id)).limit(1);
      if (existingRole.length === 0) {
        await db.insert(roles).values(role);
      }
    }
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
}

export async function seedPermissions(): Promise<void> {
  try {
    for (const permission of DEFAULT_PERMISSIONS) {
      const existingPermission = await db
        .select()
        .from(permissions)
        .where(eq(permissions.id, permission.id))
        .limit(1);
      
      if (existingPermission.length === 0) {
        await db.insert(permissions).values(permission);
      }
    }
    console.log('Permissions seeded successfully');
  } catch (error) {
    console.error('Error seeding permissions:', error);
  }
}

export async function seedRolePermissions(): Promise<void> {
  try {
    // Clear existing role permissions to avoid duplicates
    await db.delete(rolePermissions);

    // Assign permissions to roles
    for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
      const roleData = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1);
      if (roleData.length === 0) continue;

      for (const permName of perms) {
        const permData = await db
          .select()
          .from(permissions)
          .where(eq(permissions.name, permName))
          .limit(1);
        
        if (permData.length > 0) {
          await db.insert(rolePermissions).values({
            id: nanoid(),
            roleId: roleData[0].id,
            permissionId: permData[0].id,
          });
        }
      }
    }
    console.log('Role permissions seeded successfully');
  } catch (error) {
    console.error('Error seeding role permissions:', error);
  }
}

export async function initializeRBAC(): Promise<void> {
  console.log('Initializing RBAC system...');
  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();
  console.log('RBAC system initialized successfully');
}

// Higher-order function for role-based access control
export function withPermission(permission: Permission) {
  return function <T extends any[]>(
    target: (...args: T) => Promise<any>,
    context: { userId: string }
  ) {
    return async (...args: T) => {
      const hasAccess = await hasPermission(context.userId, permission);
      if (!hasAccess) {
        throw new Error(`Access denied. Required permission: ${permission}`);
      }
      return target(...args);
    };
  };
}

export function withRole(requiredRole: UserRole) {
  return function <T extends any[]>(
    target: (...args: T) => Promise<any>,
    context: { userId: string }
  ) {
    return async (...args: T) => {
      const hasRequiredRole = await hasRole(context.userId, requiredRole);
      if (!hasRequiredRole) {
        throw new Error(`Access denied. Required role: ${requiredRole}`);
      }
      return target(...args);
    };
  };
}