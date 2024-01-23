'use client';

import { zodResolver } from '@hookform/resolvers/zod';
// import { useQuery } from 'convex/react';
// import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

// import { api } from '../../../../convex/_generated/api';

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Room name must be at least 1 character long.',
  }),
  members: z
    .object({
      name: z.array(z.string()),
    })
    .array(),
});

export default function DashboardPage() {
  // const rooms = useQuery(api.rooms.getMyRooms);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      members: [],
    },
  });

  return (
    <div>
      <h1 className="font-bold text-2xl text-center">Dashboard</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => console.log(values))}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room name</FormLabel>
                <FormControl>
                  <Input placeholder="DIT Faculty" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed to users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <FormDescription>
                    This is the name that will be displayed to users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Create room</Button>
        </form>
      </Form>

      {/* {!rooms ? (
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
      )} */}
    </div>
  );
}
