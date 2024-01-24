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
    creator: v.string(),
  }).index('by_name', ['name']),
  events: defineTable({
    type: v.string(),
    member: v.id('members'),
  }).index('by_type', ['type']),
});
