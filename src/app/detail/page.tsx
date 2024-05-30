"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Spinner,
  useColorModeValue,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import { buyArticle, getImageUrl, getPrice, setLuckDraw } from "@/lib/utils";
import Image from "next/image";
import { useArticle } from "@/context/articleContext";
import { useUser } from "@/context/userContext";
import { redirect } from "next/navigation";

export default function Detail() {
  const { article } = useArticle();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Center minH="80vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !article) {
    return redirect("/");
  }

  let prices = getPrice(article);
  const free = user?.freeArticles;
  if (free) prices = 0;

  const imageUrl = getImageUrl(article);

  const handleBuyArticle = () => {
    if (!article) return;

    setBuying(true);
    const result = buyArticle(article, prices);

    if (result.error) {
      toast({
        title: "Purchase failed.",
        description:
          result.error === "Article already owned."
            ? "You already own this article."
            : result.error,
        status: "error",
        position: "bottom-right",
        duration: 2000,
        isClosable: true,
      });
    } else {
      setUser(setLuckDraw(result.account!!)?.account!!);
      toast({
        title: "Purchase successful.",
        description: "You have successfully purchased the article.",
        status: "success",
        position: "bottom-right",
        duration: 2000,
        isClosable: true,
      });
    }
    setBuying(false);
  };

  return (
    <Center py={6}>
      <Box
        maxW={{ base: "full", md: "800px" }}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
        transition="all 0.3s ease-in-out"
        h="auto"
      >
        <Box h={"400px"} bg={"gray.100"} mx={-6} mb={6} pos={"relative"}>
          <Image
            alt="blog post image"
            src={imageUrl}
            layout={"fill"}
            objectFit={"cover"}
          />
        </Box>
        <Stack h="auto" justifyContent="space-between">
          <Stack spacing={3}>
            <Text
              color={"blue.300"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              {article.section}
            </Text>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              {article.title}
            </Heading>
            <Text color={"gray.500"}>{article.abstract}</Text>
          </Stack>
          <Flex justifyContent="space-between" alignItems="center">
            <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
              <Text fontWeight={600}>
                {article.published_date} ·{" "}
                {prices > 0 ? `$${prices.toLocaleString("id-ID")}` : "Free"}
              </Text>
            </Stack>
            <Button
              colorScheme="blue"
              variant="solid"
              isLoading={buying}
              onClick={handleBuyArticle}
            >
              Buy
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Center>
  );
}
