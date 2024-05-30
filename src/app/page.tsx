"use client";

import { useState, useEffect } from "react";
import BlogPost from "@/components/blog.post";
import {
  Center,
  SimpleGrid,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { ApiResponseType } from "@/types/api";
import { useArticle } from "@/lib/api";
import PostPagination from "@/components/post.pagination";
import { useUser } from "@/context/userContext";

export default function Home() {
  const [articles, setArticles] = useState<ApiResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const isLogged = useUser().user;

  useEffect(() => {
    if (!isLogged) {
      return redirect("/login");
    }
    const fetchArticles = async () => {
      try {
        const data = await useArticle("emailed");
        setArticles(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <Center minH="80vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Flex minH="80vh" p={6} flexDir={"column"}>
        <Alert status="error">
          <AlertIcon />
          There was an error fetching the articles.
        </Alert>
      </Flex>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = articles.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Center minH="80vh" flexDirection="column" gap={2} p={4}>
      <Text fontSize="2xl" mb={4}>
        A website for ordering articles and news
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing={6}>
        {currentItems.map((article) => (
          <BlogPost data={article} key={article.id} />
        ))}
      </SimpleGrid>
      <PostPagination
        itemsPerPage={itemsPerPage}
        totalItems={articles.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </Center>
  );
}
