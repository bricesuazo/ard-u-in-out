'use client';

import { type Doc, type Id } from 'convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Fingerprint, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AlertDialogHeader } from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

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
        <div className="grid place-items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : room === null ? (
        <h1 className="text-center font-bold text-xl">Room not found</h1>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="mt-8">
              <h1 className="text-center font-bold text-2xl">{room.name}</h1>
              <p className="text-center text-sm">{new Date().toDateString()}</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {room.members.map((member) => (
                  <Member key={member._id} member={member} roomId={room._id} />
                ))}
              </TableBody>
            </Table>
          </div>

          <div
            className="aspect-square grid place-items-center p-10"
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='%233359' stroke-width='12' stroke-dasharray='8%2c 28' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
            }}
          >
            <div className="flex flex-col items-center gap-y-4 text-gray-500">
              <Fingerprint size="4rem" />
              <h2 className="text-balance text-center">
                Tap your card to check in/out
                <br />
                for {room.name}
              </h2>
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
    <TableRow>
      <TableCell>
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
                onClick={() => {
                  setLoading(true);

                  const promise = changeStatusMutation({
                    roomId,
                    type: 'IN',
                    memberId: member._id,
                  }).finally(() => {
                    setLoading(false);
                    setOpen(false);
                  });

                  toast.promise(promise, {
                    loading: 'Changing status...',
                    success: 'Status changed successfully.',
                    error: 'Failed to change status.',
                  });
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
      </TableCell>
      <TableCell>{member.name}</TableCell>
      <TableCell className="text-center">{member.eventType}</TableCell>

      {/* <div className="place-self-center">
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
      </div> */}
    </TableRow>
  );
}
