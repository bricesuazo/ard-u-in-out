import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  members: defineTable({
    name: v.string(),
    room: v.id('rooms'),
  }).index('by_name', ['name']),

  rooms: defineTable({
    name: v.string(),
    members: v.array(v.id('members')),
    creator: v.id('users'),
  }).index('by_name', ['name']),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    tokenIdentifier: v.string(),
  })
    .index('by_name', ['name'])
    .index('by_email', ['email'])
    .index('by_tokenIdentifier', ['tokenIdentifier']),

  events: defineTable({
    type: v.string(),
    member: v.id('members'),
  }).index('by_type', ['type']),
});
