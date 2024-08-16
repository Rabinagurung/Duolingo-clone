import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core';

/*
 * === Relations ===
 * Define the relationships between the tables
 * There are 7 tables in the schema
 * The relationships are as follows:
 * Courses ↔ User Progress: One-to-Many (One course can have many user progress records, but each user progress record is linked to only one active course).
 * Courses ↔ Units: One-to-Many (One course can have many units, but each unit belongs to only one course).
 * Units ↔ Lessons: One-to-Many (One unit can have many lessons, but each lesson belongs to only one unit).
 * Lessons ↔ Challenges: One-to-Many (One lesson can have many challenges, but each challenge belongs to only one lesson).
 * Challenges ↔ Challenge Options: One-to-Many (One challenge can have many challenge options, but each challenge option belongs to only one challenge).
 * Challenges ↔ Challenge Progress: One-to-Many (One challenge can have many progress records, but each progress record belongs to only one challenge).
 */

// === Schema ===

// Courses
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull()
});

// Relations for courses table
// The courses table has many userProgress and units
export const coursesRetlations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units)
}));

// Units
export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, {
    onDelete: 'cascade'
  }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  order: integer('order').notNull()
});

// Relations for units table
// The units table has one course
export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id]
  }),
  lessons: many(lessons)
}));

// Lessons
// This table is used to store the lessons for each unit
// It has a foreign key to the units table
// The order field is used to order the lessons

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id').references(() => units.id, {
    onDelete: 'cascade'
  }),
  title: text('title').notNull(),
  order: integer('order').notNull()
});

// Relations for lessons table
// The lessons table has one unit
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id]
  }),
  challenges: many(challenges)
}));

export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST']);

export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id').references(() => lessons.id, {
    onDelete: 'cascade'
  }),
  type: challengesEnum('type').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  order: integer('order').notNull()
});

// Relations for challenges table
// The challenges table has one lesson
export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id]
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress)
}));

export const challengeOptions = pgTable('challenge_options', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id').references(() => challenges.id, {
    onDelete: 'cascade'
  }),
  text: text('text').notNull(),
  correct: boolean('correct').notNull().default(false),
  order: integer('order').notNull(),
  imageSrc: text('image_src'),
  audioSrc: text('audio_src')
});

// Relations for challengeOptions table
// The challengeOptions table has one challenge
export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id]
    })
  })
);

export const challengeProgress = pgTable('challenge_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  challengeId: integer('challenge_id').references(() => challenges.id, {
    onDelete: 'cascade'
  }),
  completed: boolean('completed').notNull().default(false)
});

// Relations for challengeProgress table
// The challengeProgress table has one challenge
export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id]
    })
  })
);

// User Progress
// This table is used to store the user's progress in the course
// It has a foreign key to the courses table
// It also has a foreign key to the active course
// The active course is the course that the user is currently taking
export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('Anonymous'),
  userImageSrc: text('user_image_src').notNull().default('/mascot.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, {
    onDelete: 'cascade'
  }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0)
});

// Relations for userProgress table
// The userProgress table has one activeCourse
// The activeCourse is the course that the user is currently taking

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id]
  })
}));

export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  subscriptionId: text('subscription_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end').notNull()
});

// === End Schema ===
