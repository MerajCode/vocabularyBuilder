CREATE TABLE `bar_notification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`timer` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
