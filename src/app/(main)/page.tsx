'use client';

import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '~/components/ui/skeleton';

import { api } from '../../../convex/_generated/api';

export default function Home() {
  const router = useRouter();
  const rooms = useQuery(api.rooms.getAllRooms);
  return (
    <div>
      <h1 className="font-bold text-2xl text-center my-4">Rooms</h1>

      {!rooms ? (
        <div className="space-y-1">
          <Skeleton className="h-20 rounded" />
          <Skeleton className="h-20 rounded" />
          <Skeleton className="h-20 rounded" />
        </div>
      ) : rooms.length === 0 ? (
        <p className="text-center">No rooms found</p>
      ) : (
        <div className="flex flex-col gap-y-1">
          {rooms.map((room) => (
            <button
              key={room._id}
              className="text-left border hover:bg-muted p-4 rounded"
              onClick={() => router.push(`/room/${room._id}`)}
            >
              <h2 className="font-semibold">{room.name}</h2>
              <p className="text-sm line-clamp-1">
                Members: {room.members.map((member) => member.name).join(', ')}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
