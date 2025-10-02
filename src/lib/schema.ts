import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
})

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
})

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
})

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
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
})

export const orderItems = sqliteTable("orderItems", {
  id: text("id").primaryKey(),
  orderId: text("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId").notNull(),
  variantId: text("variantId"),
  name: text("name").notNull(),
  price: integer("price").notNull(), // in paisa/cents
  quantity: integer("quantity").notNull(),
  image: text("image").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
})
