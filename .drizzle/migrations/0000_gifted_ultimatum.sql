CREATE TABLE IF NOT EXISTS "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner" integer NOT NULL,
	"name" varchar(50) NOT NULL,
	"counter_photo" integer DEFAULT 0 NOT NULL,
	"location" varchar(250) NOT NULL,
	"created_at" varchar(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS "photographers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(50) NOT NULL,
	"password" varchar NOT NULL,
	"login" varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS "photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "photoSchema" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" integer NOT NULL,
	"name" varchar(50),
	"people" varchar[] DEFAULT '{}'::varchar[],
	"original_resized_url" varchar DEFAULT 'https://photo-drop.onrender.com/albums/7/photos/01a3597bc0eedbd0ac15da64a928a0d2' NOT NULL,
	"watermark_resized_url" varchar DEFAULT 'https://photo-drop.onrender.com/albums/7/photos/01a3597bc0eedbd0ac15da64a928a0d2' NOT NULL,
	"original_url" varchar DEFAULT 'https://photo-drop.onrender.com/albums/7/photos/01a3597bc0eedbd0ac15da64a928a0d2' NOT NULL,
	"watermark_url" varchar DEFAULT 'https://photo-drop.onrender.com/albums/7/photos/01a3597bc0eedbd0ac15da64a928a0d2' NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "albums" ADD CONSTRAINT "albums_owner_photographers_id_fk" FOREIGN KEY ("owner") REFERENCES "photographers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "photoSchema" ADD CONSTRAINT "photoSchema_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
