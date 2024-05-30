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
import { registerAccount } from "@/lib/utils";
import { AccountType } from "@/types/account";
import { redirect } from "next/navigation";

function RegisterForm() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountType>();
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const onSubmit = async (values: AccountType) => {
    const { error } = await registerAccount(values);

    if (error) {
      if (error.includes("Username")) {
        setError("username", { type: "validate", message: error });
      } else if (error.includes("Email")) {
        setError("email", { type: "validate", message: error });
      }
      return;
    }

    toast({
      title: "Account created.",
      description: "We've created your account for you.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
      onCloseComplete: () => {
        redirect("/login");
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));
  };
  return (
    <Stack spacing={8} w={"100%"} maxW={"lg"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading
          fontSize={{
            base: "2xl",
            md: "3xl",
            lg: "4xl",
          }}
        >
          Register
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          Already have an account?{" "}
          <LinkBox as="span" color={"blue.400"}>
            <Link href="/login">Login here</Link>
          </LinkBox>
          .
        </Text>
      </Stack>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="username" isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Enter your username"
                {...register("username", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="email" isInvalid={!!errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input
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
            <FormControl id="password" isInvalid={!!errors.password}>
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
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
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
              bg={"blue.400"}
              color={"white"}
              mt={6}
              _hover={{ bg: "blue.500" }}
              isLoading={isSubmitting}
              type="submit"
            >
              Create account
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}

RegisterForm.displayName = "RegisterForm";

export default RegisterForm;
