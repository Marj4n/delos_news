"use client";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  LinkBox,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { compare, getStorage, setSession } from "@/lib/utils";
import { AccountType } from "@/types/account";

export default function () {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountType>();
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const onSubmit = async (values: AccountType) => {
    const existingAccounts = getStorage<AccountType[]>("accounts") || [];
    const account = existingAccounts.find((acc) => acc.email === values.email);

    if (!account) {
      setError("email", {
        type: "validate",
        message: "Email address not found. Please register first.",
      });
      return;
    }

    const isPasswordCorrect = await compare(values.password, account.password);
    if (!isPasswordCorrect) {
      setError("password", {
        type: "validate",
        message: "Incorrect password.",
      });
      return;
    }

    // Set session with user account
    setSession(account);

    toast({
      title: "Login successful.",
      description: "Redirecting to home page.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
      onCloseComplete: () => {
        window.location.reload();
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <Stack spacing={8} w="100%" maxW="lg" py={12} px={6}>
      <Stack align="center">
        <Heading fontSize="4xl">Login to your account</Heading>
        <Text fontSize="lg" color="gray.600">
          Don't have an account?{" "}
          <LinkBox as="span" color="blue.400">
            <Link href="/register">Register here</Link>
          </LinkBox>
          .
        </Text>
      </Stack>
      <Box
        rounded="lg"
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="lg"
        p={8}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email address"
                {...register("email", {
                  required: "This is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "This is required",
                    minLength: {
                      value: 6,
                      message: "Minimum length should be 6",
                    },
                  })}
                />
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword((show) => !show)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              bg="blue.400"
              color="white"
              mt={6}
              _hover={{ bg: "blue.500" }}
              isLoading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}
