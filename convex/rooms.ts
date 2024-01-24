import { v } from 'convex/values';

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
export const getMyRooms = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new Error('Not logged in');

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
