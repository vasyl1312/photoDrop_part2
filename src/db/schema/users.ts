import { InferModel } from 'drizzle-orm'
import { pgTable, varchar, uuid, uniqueIndex } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    phone: varchar('phone', { length: 15 }).notNull(),
    name: varchar('name', { length: 50 }),
    email: varchar('email', { length: 50 }),
    token: varchar('token'),
    verificationToken: varchar('verification_token'),
    avatar: varchar('avatar'),
  },
  (table) => ({
    phoneIndex: uniqueIndex('phoneIdx').on(table.phone),
  })
)

export type TUsers = InferModel<typeof users>
export type TNewUsers = InferModel<typeof users, 'insert'>
