import { useState } from "react";
import {
  Button,
  Text,
  Alert,
  AlertIcon,
  Heading,
  Center,
  Box,
} from "@chakra-ui/react";
import { getSession, redeemTicket } from "@/lib/utils";
import { useUser } from "@/context/userContext";

const emojis = ["🎉", "🎊", "🎁", "🎲", "🎯", "🎈"];

export default function LuckyDraw() {
  const [reward, setReward] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUser();
  const [isRunning, setIsRunning] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<string>("?");
  const [_interval, _setInterval] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const handleRedeem = () => {
    const session = getSession();
    if (!session) {
      setError("User not logged in.");
      return;
    }

    if (isRunning) {
      clearInterval(_interval);
      setIsRunning(false);
      const { account, reward, error } = redeemTicket(session);
      if (error) {
        setError(error);
        return;
      }
      setUser(account!!);
      setReward(reward!!);
      setError(null);
    } else {
      setIsRunning(true);
      _setInterval(
        setInterval(() => {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          setCurrentChoice(randomEmoji);
        }, 50)
      );
    }
  };

  return (
    <Center minH="80vh" flexDirection="column" gap={4} p={4}>
      <Text fontSize="2xl" mb={4}>
        Lucky Draw
      </Text>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      {reward && (
        <Alert status="success" mb={4}>
          <AlertIcon />
          You won: {reward}
        </Alert>
      )}
      <Heading fontSize="xl" mb={4}>
        You have {user?.luckyDraw} chances left.
      </Heading>
      <Box
        border="2px"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        textAlign="center"
        mb={4}
      >
        <Text fontSize="4xl">{currentChoice}</Text>
      </Box>
      <Button
        colorScheme={isRunning ? "red" : "blue"}
        onClick={handleRedeem}
        isDisabled={user?.luckyDraw === 0}
      >
        {isRunning ? "Stop" : "Redeem Ticket"}
      </Button>
    </Center>
  );
}
