"use client";

import LuckyDraw from "@/components/lucky.draw";
import { useUser } from "@/context/userContext";
import { Center } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default function Detail() {
  const { user: isLogged } = useUser();

  if (!isLogged) {
    return redirect("/login");
  }
  return (
    <Center py={6} flexDirection="column">
      <LuckyDraw />
    </Center>
  );
}
