import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getRooms = query({
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error('Not logged in');
    // }

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

export const createRoom = mutation({
  args: { name: v.string(), members_name: v.array(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not logged in');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_tokenIdentifier', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.insert('rooms', {
      name: args.name,
      members: [],
      creator: user._id,
    });
  },
});
