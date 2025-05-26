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
