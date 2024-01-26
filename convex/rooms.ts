import { v } from 'convex/values';
import dayjs from 'dayjs';

import { mutation, query } from './_generated/server';

export const getAllRooms = query({
  handler: async (ctx) => {
    const rooms = await ctx.db.query('rooms').collect();

    return Promise.all(
      rooms.map(async (room) => {
        const members = await ctx.db
          .query('members')
          .filter((q) => q.eq(q.field('room'), room._id))
          .collect();

        return {
          ...room,
          members,
        };
      }),
    );
  },
});
export const getRoom = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('rooms')
      .filter((q) => q.eq(q.field('_id'), args.id))
      .unique();

    if (!room) throw new Error('Room not found');

    const membersWithoutEvent = await ctx.db
      .query('members')
      .filter((q) => q.eq(q.field('room'), room._id))
      .collect();

    const members = await Promise.all(
      membersWithoutEvent.map(async (member) => {
        const event = await ctx.db
          .query('events')
          .filter((q) => q.eq(q.field('member'), member._id))
          .filter((q) => q.eq(q.field('room'), room._id))
          .order('desc')
          .first();

        return {
          ...member,
          eventType:
            event && dayjs().isSame(dayjs(event._creationTime), 'D')
              ? event.type
              : 'OUT',
        };
      }),
    );

    return {
      ...room,
      members,
    };
  },
});
export const getMyRooms = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) return;

    const rooms = await ctx.db
      .query('rooms')
      .filter((q) => q.eq(q.field('creator'), user.subject))
      .collect();

    return Promise.all(
      rooms.map(async (room) => {
        const members = await ctx.db
          .query('members')
          .filter((q) => q.eq(q.field('room'), room._id))
          .collect();

        return {
          ...room,
          members,
        };
      }),
    );
  },
});
export const memberHistory = query({
  args: { memberId: v.id('members') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) return;

    const events = await ctx.db
      .query('events')
      .filter((q) => q.eq(q.field('member'), args.memberId))
      .order('desc')
      .collect();

    return events;
  },
});

export const createRoom = mutation({
  args: { name: v.string(), members_name: v.array(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new Error('Not logged in');

    const room = await ctx.db.insert('rooms', {
      name: args.name,
      members: [],
      creator: user.subject,
    });

    const members = await Promise.all(
      args.members_name.map(async (name) => {
        const member = await ctx.db.insert('members', {
          name,
          room,
        });

        return member;
      }),
    );

    await ctx.db.patch(room, { members });
  },
});

export const changeStatus = mutation({
  args: { type: v.string(), roomId: v.id('rooms'), memberId: v.id('members') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new Error('Not logged in');

    const createdEvent = await ctx.db.insert('events', {
      room: args.roomId,
      type: args.type,
      member: args.memberId,
    });

    const event = await ctx.db.get(createdEvent);

    if (!event) throw new Error('Event not found');

    const member = await ctx.db.get(args.memberId);

    if (!member) throw new Error('Member not found');

    return member;
  },
});
