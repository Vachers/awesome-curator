import { pgTable, serial, varchar, text, integer, timestamp, json, boolean } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  emoji: varchar('emoji', { length: 10 }),
  color: varchar('color', { length: 7 }), // hex color
  createdAt: timestamp('created_at').defaultNow(),
});

export const repos = pgTable('repos', {
  id: serial('id').primaryKey(),
  githubId: integer('github_id').notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  description: text('description'),
  url: varchar('url', { length: 500 }).notNull(),
  language: varchar('language', { length: 50 }),
  topics: json('topics').$type<string[]>(),
  stars: integer('stars').default(0),
  forks: integer('forks').default(0),
  isPrivate: boolean('is_private').default(false),
  isFork: boolean('is_fork').default(false),
  categoryId: integer('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  syncedAt: timestamp('synced_at').defaultNow(),
});

export const awesomeLists = pgTable('awesome_lists', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  repoUrl: varchar('repo_url', { length: 500 }),
  content: text('content'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Repo = typeof repos.$inferSelect;
export type AwesomeList = typeof awesomeLists.$inferSelect;
