CREATE TABLE `scheduled_notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`timer` integer NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`timer` integer NOT NULL,
	`unlock_type` text,
	`unlock_status` integer DEFAULT false,
	`present_type` text,
	`present_status` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word` text NOT NULL,
	`type` text,
	`meaning` text,
	`form1` text,
	`form2` text,
	`form3` text,
	`example` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
