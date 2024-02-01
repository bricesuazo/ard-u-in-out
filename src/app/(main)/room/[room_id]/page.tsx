import { auth } from '@clerk/nextjs';

import { RoomPageClient } from './_components/page-client';

export default function RoomPage({
  params: { room_id },
}: {
  params: { room_id: string };
}) {
  const { userId } = auth();

  return <RoomPageClient userId={userId} room_id={room_id} />;
}
