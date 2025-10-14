CREATE TABLE `chatAgents` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`isOnline` integer DEFAULT false NOT NULL,
	`currentSessions` integer DEFAULT 0 NOT NULL,
	`maxSessions` integer DEFAULT 5 NOT NULL,
	`specialties` text,
	`lastActiveAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionId` text NOT NULL,
	`senderId` text,
	`senderType` text NOT NULL,
	`message` text NOT NULL,
	`messageType` text DEFAULT 'text' NOT NULL,
	`metadata` text,
	`isRead` integer DEFAULT false NOT NULL,
	`sentAt` integer NOT NULL,
	FOREIGN KEY (`sessionId`) REFERENCES `chatSessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chatSessionAssignments` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionId` text NOT NULL,
	`agentId` text NOT NULL,
	`assignedAt` integer NOT NULL,
	`endedAt` integer,
	FOREIGN KEY (`sessionId`) REFERENCES `chatSessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`agentId`) REFERENCES `chatAgents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chatSessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`sessionId` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`userAgent` text,
	`ipAddress` text,
	`startedAt` integer NOT NULL,
	`endedAt` integer,
	`customerSatisfactionRating` integer,
	`tags` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chatSessions_sessionId_unique` ON `chatSessions` (`sessionId`);