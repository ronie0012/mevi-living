import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: text("role").notNull().default("user"), // Default role is 'user'
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Roles table
export const roles = sqliteTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., 'admin', 'user', 'moderator'
  description: text("description"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Permissions table
export const permissions = sqliteTable("permissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., 'read:users', 'write:products', 'delete:orders'
  description: text("description"),
  resource: text("resource").notNull(), // e.g., 'users', 'products', 'orders'
  action: text("action").notNull(), // e.g., 'read', 'write', 'delete', 'create'
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Role permissions junction table
export const rolePermissions = sqliteTable("role_permissions", {
  id: text("id").primaryKey(),
  roleId: text("roleId")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permissionId: text("permissionId")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// User roles junction table (for multiple roles per user if needed)
export const userRoles = sqliteTable("user_roles", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  roleId: text("roleId")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Orders table
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("orderNumber").notNull().unique(),
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  subtotal: integer("subtotal").notNull(), // in paisa/cents
  shippingCost: integer("shippingCost").notNull(),
  tax: integer("tax").notNull(),
  total: integer("total").notNull(),
  // Shipping information
  shippingFirstName: text("shippingFirstName").notNull(),
  shippingLastName: text("shippingLastName").notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: text("shippingCity").notNull(),
  shippingState: text("shippingState").notNull(),
  shippingZipCode: text("shippingZipCode").notNull(),
  shippingPhone: text("shippingPhone").notNull(),
  shippingMethod: text("shippingMethod").notNull(),
  paymentMethod: text("paymentMethod").notNull(),
  paymentStatus: text("paymentStatus").notNull().default("pending"), // pending, paid, failed, refunded
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Order Items table
export const orderItems = sqliteTable("orderItems", {
  id: text("id").primaryKey(),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId").notNull(),
  variantId: text("variantId"),
  name: text("name").notNull(),
  price: integer("price").notNull(), // in paisa/cents
  quantity: integer("quantity").notNull(),
  image: text("image").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(user, {
    fields: [userRoles.userId],
    references: [user.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));
