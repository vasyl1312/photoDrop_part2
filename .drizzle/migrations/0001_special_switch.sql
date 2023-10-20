CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(15) NOT NULL,
	"name" varchar(50),
	"email" varchar(50),
	"token" varchar,
	"verification_token" varchar,
	"avatar" varchar
);

CREATE UNIQUE INDEX IF NOT EXISTS "phoneIdx" ON "users" ("phone");