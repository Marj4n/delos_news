"use client";

import BlogPost from "@/components/blog.post";
import { useUser } from "@/context/userContext";
import { getOwnedArticles } from "@/lib/utils";
import { ApiResponseType } from "@/types/api";
import { Box, Center, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Collection() {
  const { user } = useUser();
  const [ownedArticles, setOwnedArticles] = useState<ApiResponseType[]>([]);

  useEffect(() => {
    if (user) {
      const userOwnedArticles = getOwnedArticles(user);
      setOwnedArticles(userOwnedArticles);
    }
  }, [user]);

  if (!user) {
    return redirect("/");
  }

  return (
    <Center py={6}>
      <Box
        w={"full"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
        transition="all 0.3s ease-in-out"
        h="auto"
      >
        <VStack spacing={6}>
          <Center>
            <Heading fontSize="2xl" mb={4}>
              Owned Articles
            </Heading>
          </Center>
          <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing={6}>
            {ownedArticles.map((article) => (
              <BlogPost key={article.id} data={article} owned={true} />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </Center>
  );
}
