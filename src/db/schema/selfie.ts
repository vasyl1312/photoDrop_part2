import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { users } from './users'
import { InferModel } from 'drizzle-orm'

export const usersSelfie = pgTable('users_selfie', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  url: varchar('url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type TUsersSelfie = InferModel<typeof usersSelfie>
export type TNewUsersSelfie = InferModel<typeof usersSelfie, 'insert'>
