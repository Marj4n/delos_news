"use client";

import { Center } from "@chakra-ui/react";
import Form from "./form";
import { getSession } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function Register() {
  const session = getSession();
  if (session) {
    return redirect("/");
  }
  return (
    <Center minH="80vh">
      <Form />
    </Center>
  );
}
