// app/user/[id]/page.tsx
// import { POST } from "@/app/api/users/route";

import { GET } from "@/app/api/users/route";
import { prisma } from "@/lib/prisma";
// import { useEffect } from "react";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  // Await the params object (for Next.js App Router)
  const { id } = await params; // <-- this fixes the warning

  // eslint-disable-next-line react-hooks/rules-of-hooks
  //   useEffect(() => {
  // const user1 = await prisma.user.create({
  //   data: {
  //     id: parseInt(id) + Math.random() * 1000000,
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //   },
  // });
  // console.log(user1.name);
  //   }, []);

  //   const users =awai/t GET();

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }, // use the awaited id
  });

  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
