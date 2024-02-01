'use client';

import { type Doc, type Id } from 'convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Fingerprint, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { api } from '../../../../../convex/_generated/api';

dayjs.extend(relativeTime);

export default function RoomPage({
  params: { room_id },
}: {
  params: { room_id: string };
}) {
  const [today, setToday] = useState(new Date());

  const room = useQuery(api.rooms.getRoom, { id: room_id });

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
              <p className="text-center text-sm">
                {dayjs(today).format('MMMM D, YYYY')}
              </p>
              <p className="text-center text-sm">
                {dayjs(today).format('h:mm:ss A')}
              </p>
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
                  <Member
                    key={member._id}
                    member={member}
                    roomId={room._id}
                    today={today}
                  />
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
  today,
}: {
  member: Doc<'members'> & { eventType: string };
  roomId: Id<'rooms'>;
  today: Date;
}) {
  const [openHistory, setOpenHistory] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);

  const memberHistory = useQuery(api.rooms.memberHistory, {
    memberId: member._id,
  });

  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {isDesktop ? (
        <>
          <Dialog open={openHistory} onOpenChange={setOpenHistory}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{member.name}</DialogTitle>
                <DialogDescription>
                  History of {member.name} this day.
                </DialogDescription>
              </DialogHeader>

              <MemberHistory
                memberHistory={memberHistory}
                memberName={member.name}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openChangeStatus} onOpenChange={setOpenChangeStatus}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change status for {member.name}</DialogTitle>
              </DialogHeader>

              <StatusChange
                member={member}
                roomId={roomId}
                setOpenChangeStatus={setOpenChangeStatus}
                today={today}
              />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <Drawer open={openHistory} onOpenChange={setOpenHistory}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>{member.name}</DrawerTitle>
                <DrawerDescription>
                  History of {member.name} this day.
                </DrawerDescription>
              </DrawerHeader>

              <MemberHistory
                memberHistory={memberHistory}
                memberName={member.name}
              />

              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Drawer open={openChangeStatus} onOpenChange={setOpenChangeStatus}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>{member.name}</DrawerTitle>
                <DrawerDescription>
                  Change status for {member.name}
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4">
                <StatusChange
                  member={member}
                  roomId={roomId}
                  setOpenChangeStatus={setOpenChangeStatus}
                  today={today}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </>
      )}
      <TableRow>
        <TableCell>
          <Button size="xs" onClick={() => setOpenChangeStatus(true)}>
            Change
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="link"
            className="p-0"
            onClick={() => setOpenHistory(true)}
          >
            {member.name}
          </Button>
        </TableCell>
        <TableCell className="text-center">{member.eventType}</TableCell>
      </TableRow>
    </>
  );
}

function StatusChange({
  member,
  today,
  roomId,
  setOpenChangeStatus,
}: {
  member: Doc<'members'> & { eventType: string };
  today: Date;
  roomId: Id<'rooms'>;
  setOpenChangeStatus: (value: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const changeStatusMutation = useMutation(api.rooms.changeStatus);

  function onChangeStatus(status: 'IN' | 'OUT' | 'IN MEETING') {
    setLoading(true);

    const promise = changeStatusMutation({
      roomId,
      type: status,
      memberId: member._id,
    }).finally(() => {
      setLoading(false);
      setOpenChangeStatus(false);
    });

    toast.promise(promise, {
      loading: 'Changing status...',
      success: (member) => `Status changed to ${member.name}.`,
      error: 'Failed to change status.',
    });
  }
  return (
    <>
      <h2 className="text-center font-semibold text-4xl">
        {dayjs(today).format('h:mm:ss A')}
      </h2>

      <div>
        <div className="flex">
          <Button
            disabled={loading || member.eventType === 'IN'}
            onClick={() => onChangeStatus('IN')}
            variant="ghost"
            className="h-40 text-xl flex-1"
          >
            In
          </Button>
          <Button
            disabled={loading || member.eventType === 'OUT'}
            onClick={() => onChangeStatus('OUT')}
            variant="ghost"
            className="h-40 text-xl flex-1"
          >
            Out
          </Button>
        </div>
        <Button
          disabled={loading || member.eventType === 'IN MEETING'}
          onClick={() => onChangeStatus('IN MEETING')}
          variant="ghost"
          className="h-20 text-xl flex-1 w-full"
        >
          In Meeting
        </Button>
      </div>
    </>
  );
}

function MemberHistory({
  memberName,
  memberHistory,
}: {
  memberName: string;
  memberHistory?: Doc<'events'>[] | null;
}) {
  return !memberHistory ? (
    <div className="grid place-items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : memberHistory.length === 0 ? (
    <div className="grid place-items-center p-8">
      <p className="text-center text-gray-500">
        No history for {memberName} this day.
      </p>
    </div>
  ) : (
    <ScrollArea className="h-96">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">Event</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberHistory.map((history) => {
            const createdAt = dayjs(history._creationTime);
            return (
              <TableRow key={history._id}>
                <TableCell>
                  <p>{createdAt.format('h:mm:ss A')}</p>
                  <p className="text-xs text-muted-foreground">
                    {createdAt.fromNow()}
                  </p>
                </TableCell>
                <TableCell className="text-center">{history.type}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
