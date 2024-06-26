import { Heading, Text, Button, Center } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Center minH="80vh" flexDirection="column">
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you&apos;re looking for does not seem to exist
      </Text>

      <Link href="/">
        <Button
          colorScheme="blue"
          bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
          color="white"
          variant="solid"
        >
          Go to Home
        </Button>
      </Link>
    </Center>
  );
}
