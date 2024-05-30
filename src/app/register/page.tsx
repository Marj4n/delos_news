"use client";

import { Center } from "@chakra-ui/react";
import Form from "./form";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/utils";

export default function Register() {
  const isLogged = getSession();
  if (isLogged) {
    redirect("/");
  }
  return (
    <Center minH="80vh">
      <Form />
    </Center>
  );
}
