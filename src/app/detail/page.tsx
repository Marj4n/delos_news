"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Center,
  Spinner,
  Stack,
  useColorModeValue,
  Flex,
  Text,
} from "@chakra-ui/react";
import { getPrice, getImageUrl } from "@/lib/utils";
import { useArticle } from "@/context/articleContext";
import { useUser } from "@/context/userContext";
import { redirect } from "next/navigation";
import ArticleHeader from "@/components/article.header";
import PurchaseButton from "@/components/purchase.button";

export default function Detail() {
  const { article } = useArticle();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue("white", "gray.900");

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

  return (
    <Center py={6}>
      <Box
        maxW={{ base: "full", md: "800px" }}
        w={"full"}
        bg={bgColor}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
        transition="all 0.3s ease-in-out"
        h="auto"
      >
        <ArticleHeader article={article} imageUrl={imageUrl} />
        <Flex justifyContent="space-between" alignItems="center" mt={6}>
          <Stack direction={"row"} spacing={4} align={"center"}>
            <Text fontWeight={600}>
              {article.published_date} ·{" "}
              {prices > 0 ? `$${prices.toLocaleString("id-ID")}` : "Free"}
            </Text>
          </Stack>
          <PurchaseButton article={article} price={prices} />
        </Flex>
      </Box>
    </Center>
  );
}
