'use client';

import { type Doc, type Id } from 'convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { AlertDialogHeader } from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { api } from '../../../../../convex/_generated/api';

export default function RoomPage({
  params: { room_id },
}: {
  params: { room_id: string };
}) {
  const room = useQuery(api.rooms.getRoom, { id: room_id });

  return (
    <div className="">
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
          <p className="text-center text-sm">{new Date().toDateString()}</p>
          <div className="space-y-2">
            <div className="grid grid-cols-6 mt-10 space-y-4 gap-2">
              <div />
              <div className="col-span-3" />
              <p className="place-self-center">In</p>
              <p className="place-self-center">Out</p>
            </div>
            <div className="space-y-4">
              {room.members.map((member) => (
                <Member key={member._id} member={member} roomId={room._id} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Member({
  member,
  roomId,
}: {
  member: Doc<'members'> & { eventType: string };
  roomId: Id<'rooms'>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const changeStatusMutation = useMutation(api.rooms.changeStatus);

  return (
    <div className="grid grid-cols-6 gap-2">
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="xs">Change</Button>
          </DialogTrigger>
          <DialogContent>
            <AlertDialogHeader>
              <DialogTitle>Change status for {member.name}</DialogTitle>
            </AlertDialogHeader>

            <div className="flex">
              <Button
                disabled={loading || member.eventType === 'IN'}
                onClick={async () => {
                  setLoading(true);
                  await changeStatusMutation({
                    roomId,
                    type: 'IN',
                    memberId: member._id,
                  });

                  setLoading(false);
                  setOpen(false);
                }}
                variant="ghost"
                className="h-40 text-xl flex-1"
              >
                In
              </Button>
              <Button
                disabled={loading || member.eventType === 'OUT'}
                onClick={async () => {
                  setLoading(true);
                  await changeStatusMutation({
                    roomId,
                    type: 'OUT',
                    memberId: member._id,
                  });

                  setLoading(false);
                  setOpen(false);
                }}
                variant="ghost"
                className="h-40 text-xl flex-1"
              >
                Out
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="col-span-3">{member.name}</div>
      <div className="place-self-center">
        {member.eventType === 'IN' ? (
          <CheckCircle2 className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
      <div className="place-self-center">
        {member.eventType === 'OUT' ? (
          <CheckCircle2 className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    </div>
  );
}
