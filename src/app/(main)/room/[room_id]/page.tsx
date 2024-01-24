'use client';

import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';

import { api } from '../../../../../convex/_generated/api';

export default function RoomPage({
  params: { room_id },
}: {
  params: { room_id: string };
}) {
  const room = useQuery(api.rooms.getRoom, { id: room_id });

  return (
    <div className="h-full my-8">
      {room === undefined ? (
        <div className="grid place-items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : room === null ? (
        <h1 className="text-center font-bold text-xl">Room not found</h1>
      ) : (
        <div>
          <h1 className="text-center font-bold text-xl">{room.name}</h1>

          <h4 className="font-medium text-lg text-center">Members</h4>
          <div>
            {room.members.map((member) => (
              <div key={member._id} className="flex">
                <div>{member.name}</div>
                {/* <div>
                  {room.events.filter((event) => event._id === member._id)}
                </div> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
