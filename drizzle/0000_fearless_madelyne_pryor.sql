CREATE TABLE `counters` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`step` integer DEFAULT 1 NOT NULL,
	`target` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `patterns` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`craft` text DEFAULT 'crochet' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`file_uri` text,
	`file_name` text,
	`source_url` text,
	`photo_uri` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`photo_uri` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `yarns` (
	`id` text PRIMARY KEY NOT NULL,
	`brand` text DEFAULT '' NOT NULL,
	`colorway` text NOT NULL,
	`weight` text,
	`fiber` text DEFAULT '' NOT NULL,
	`skeins` integer DEFAULT 1 NOT NULL,
	`yards_per_skein` integer,
	`color_hex` text,
	`photo_uri` text,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
