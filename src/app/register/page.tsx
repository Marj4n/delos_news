"use client";

import { Center } from "@chakra-ui/react";
import Form from "./form";
import { redirect } from "next/navigation";
import { useUser } from "@/context/userContext";

export default function Register() {
  const { user: isLogged } = useUser();
  if (isLogged) {
    redirect("/");
  }
  return (
    <Center minH="80vh">
      <Form />
    </Center>
  );
}
