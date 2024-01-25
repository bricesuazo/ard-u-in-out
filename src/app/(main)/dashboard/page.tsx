'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

import { api } from '../../../../convex/_generated/api';

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Room name must be at least 1 character long.',
  }),
  members: z
    .object({
      name: z.string(),
    })
    .array(),
});

const MemberSchema = z.object({
  name: z.string().min(1, {
    message: 'Room name must be at least 1 character long.',
  }),
});

export default function DashboardPage() {
  const createRoomMutation = useMutation(api.rooms.createRoom);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      members: [],
    },
  });
  const formMember = useForm<z.infer<typeof MemberSchema>>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <div>
      <h1 className="font-bold text-2xl text-center">Dashboard</h1>

      <Form {...form}>
        <form
          className="space-y-2"
          onSubmit={form.handleSubmit(async (values) => {
            await createRoomMutation({
              name: values.name,
              members_name: values.members.map((member) => member.name),
            });
            form.reset();
          })}
        >
          <div className="flex">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room name</FormLabel>
                    <FormControl>
                      <Input placeholder="DIT Faculty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              {form.getValues('members').map((member, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`members.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member&apos;s name</FormLabel>
                      <FormControl>
                        <Input placeholder="DIT Faculty" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          <Button type="submit">Create room</Button>
        </form>
      </Form>
      <Form {...formMember}>
        <form
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
                <FormLabel>Member name</FormLabel>
                <FormControl>
                  <Input placeholder="Brice Suazo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create member</Button>
        </form>
      </Form>

      <Rooms />
    </div>
  );
}

function Rooms() {
  const rooms = useQuery(api.rooms.getMyRooms);

  return !rooms ? (
    <p>Loading...</p>
  ) : rooms.length === 0 ? (
    <p>No rooms found</p>
  ) : (
    rooms.map((room) => (
      <Link href={`/room/${room._id}`} key={room._id}>
        <div className="p-4 rounded border hover:bg-gray-100">
          <h2 className="font-semibold text-xl">{room.name}</h2>
          <p>{room.members.map((member) => member.name).join(', ')}</p>
        </div>
      </Link>
    ))
  );
}
