'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';

import { api } from '../../../../convex/_generated/api';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Room name must be at least 1 character long.',
  }),
  members: z
    .object({
      name: z.string().min(1, {
        message: 'Room name must be at least 1 character long.',
      }),
    })
    .array()
    .refine((value) => value.length > 0, {
      message: 'You must have at least 1 member.',
    }),
});

const memberSchema = z.object({
  name: z.string().min(1, {
    message: 'Room name must be at least 1 character long.',
  }),
});

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div>
      <h1 className="font-bold text-2xl text-center my-4">Dashboard</h1>

      <div className="space-y-2">
        {isDesktop ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Create Room</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Room</DialogTitle>
              </DialogHeader>
              <RoomForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button>Create Room</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Create Room</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <RoomForm setOpen={setOpen} />
              </div>
            </DrawerContent>
          </Drawer>
        )}

        <Rooms />
      </div>
    </div>
  );
}

function RoomForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [isPending, startTransition] = useTransition();
  const createRoomMutation = useMutation(api.rooms.createRoom);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      members: [],
    },
  });
  const formMember = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
    },
  });
  return (
    <>
      <Form {...form}>
        <form
          className="space-y-2 flex flex-col"
          onSubmit={form.handleSubmit((values) => {
            startTransition(async () => {
              const promise = createRoomMutation({
                name: values.name,
                members_name: values.members.map((member) => member.name),
              }).finally(() => {
                form.reset();
                setOpen(false);
              });

              toast.promise(promise, {
                loading: 'Creating room...',
                success: 'Room created.',
                error: 'Failed to create room',
              });
            });
          })}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="DIT Faculty"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="ml-auto">
            Creat{!isPending ? 'e' : 'ing'} room
          </Button>
        </form>
      </Form>
      <Form {...formMember}>
        <form
          className="space-y-2"
          onSubmit={formMember.handleSubmit((values) => {
            form.setValue('members', [...form.getValues('members'), values]);
            formMember.reset();
          })}
        >
          <FormField
            control={formMember.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member&apos;s name</FormLabel>
                <div className="flex gap-x-2 items-end">
                  <FormControl>
                    <Input
                      placeholder="Brice Suazo"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    variant="outline"
                    disabled={isPending}
                    size="icon"
                    type="submit"
                  >
                    <Plus size="1rem" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('members').map((member, index) => (
            <div key={index}>
              <FormField
                control={form.control}
                name={`members.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-x-2 items-end">
                        <FormControl>
                          <Input
                            placeholder="Brice Suazo"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            form.setValue(
                              'members',
                              form
                                .getValues('members')
                                .filter((_, i) => i !== index),
                            );
                          }}
                        >
                          <Minus size="1rem" className="text-destructive" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </form>
      </Form>
    </>
  );
}

function Rooms() {
  const router = useRouter();
  const rooms = useQuery(api.rooms.getMyRooms);

  return !rooms ? (
    <div className="space-y-1">
      <Skeleton className="h-20 rounded" />
      <Skeleton className="h-20 rounded" />
      <Skeleton className="h-20 rounded" />
    </div>
  ) : rooms.length === 0 ? (
    <p className="text-center">No rooms found</p>
  ) : (
    <div className="space-y-1">
      {rooms.map((room) => (
        <button
          key={room._id}
          onClick={() => router.push(`/room/${room._id}`)}
          className="p-4 rounded border hover:bg-muted w-full text-left"
        >
          <h2 className="font-semibold">{room.name}</h2>
          <p className="text-sm">
            {room.members.map((member) => member.name).join(', ')}
          </p>
        </button>
      ))}
    </div>
  );
}
