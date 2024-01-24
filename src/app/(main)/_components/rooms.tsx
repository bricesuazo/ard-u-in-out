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
          <Link href={`/room/${room._id}`} key={room._id}>
            <div className="border hover:bg-gray-100 p-4 rounded">
              <h2 className="font-semibold">{room.name}</h2>
              <p>{room.members.map((member) => member.name).join(', ')}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
