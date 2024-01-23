'use client';

import { useQuery } from 'convex/react';
import Link from 'next/link';

import { api } from '../../../../convex/_generated/api';

export default function Rooms() {
  const rooms = useQuery(api.rooms.getAllRooms);
  return (
    <div>
      <h1 className="font-bold text-2xl text-center">Rooms</h1>

      {!rooms ? (
        <p>Loading...</p>
      ) : rooms.length === 0 ? (
        <p>No rooms found</p>
      ) : (
        rooms.map((room) => (
          <Link href={`/${room._id}`} key={room._id}>
            <h2>{room.name}</h2>
            <p>{room.members.map((member) => member.name).join(', ')}</p>
          </Link>
        ))
      )}
    </div>
  );
}
