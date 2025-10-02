CREATE TABLE `orderItems` (
	`id` text PRIMARY KEY NOT NULL,
	`orderId` text NOT NULL,
	`productId` text NOT NULL,
	`variantId` text,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`quantity` integer NOT NULL,
	`image` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`orderNumber` text NOT NULL,
	`userId` text,
	`email` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`subtotal` integer NOT NULL,
	`shippingCost` integer NOT NULL,
	`tax` integer NOT NULL,
	`total` integer NOT NULL,
	`shippingFirstName` text NOT NULL,
	`shippingLastName` text NOT NULL,
	`shippingAddress` text NOT NULL,
	`shippingCity` text NOT NULL,
	`shippingState` text NOT NULL,
	`shippingZipCode` text NOT NULL,
	`shippingPhone` text NOT NULL,
	`shippingMethod` text NOT NULL,
	`paymentMethod` text NOT NULL,
	`paymentStatus` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_orderNumber_unique` ON `orders` (`orderNumber`);