"use client";

import { Center, Spinner } from "@chakra-ui/react";
import Form from "./form";
import { getSession } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function Login() {
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
