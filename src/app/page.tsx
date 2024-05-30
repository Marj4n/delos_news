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
  Input,
  Select,
  Heading,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { ApiResponseType } from "@/types/api";
import { useArticle } from "@/lib/api";
import PostPagination from "@/components/post.pagination";
import { useUser } from "@/context/userContext";
import { OptionType } from "@/types/option";

export default function Home() {
  const [articles, setArticles] = useState<ApiResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<OptionType>("emailed");
  const itemsPerPage = 6;
  const { user: isLogged } = useUser();

  useEffect(() => {
    if (!isLogged) {
      return redirect("/login");
    }
    const fetchArticles = async () => {
      try {
        const data = await useArticle(filterType);
        setArticles(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [filterType, isLogged]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value as OptionType);
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const currentItems = filteredArticles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Center minH="80vh" flexDirection="column" gap={2} p={4}>
      <Heading fontSize="2xl" mb={4} textAlign="center">
        A website for ordering articles and news
      </Heading>
      <Flex mb={4} gap={4} w="100%" maxW="800px" flexDirection="row">
        <Input
          placeholder="Search for articles..."
          value={searchTerm}
          onChange={handleSearchChange}
          flex="1"
        />
        <Select
          value={filterType}
          onChange={handleFilterChange}
          w="auto"
          mt="0"
        >
          <option value="emailed">Emailed</option>
          <option value="shared">Shared</option>
          <option value="viewed">Viewed</option>
        </Select>
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing={6}>
        {currentItems.map((article) => (
          <BlogPost data={article} key={article.id} />
        ))}
      </SimpleGrid>
      <PostPagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredArticles.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </Center>
  );
}
