"use client";

import { useState, useEffect } from "react";
import {
  Center,
  Spinner,
  Flex,
  Alert,
  AlertIcon,
  Heading,
} from "@chakra-ui/react";
import { useUser } from "@/context/userContext";
import { OptionType } from "@/types/option";
import { redirect } from "next/navigation";
import { ApiResponseType } from "@/types/api";
import ArticleSearch from "@/components/article.search";
import ArticleList from "@/components/article.list";
import { fetchArticle } from "@/lib/api";

export default function Home() {
  const [articles, setArticles] = useState<ApiResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<OptionType>("emailed");
  const itemsPerPage = 6;
  const { user: isLogged } = useUser();

  useEffect(() => {
    if (!isLogged) {
      return redirect("/login");
    }
    const fetch = async () => {
      try {
        const data = await fetchArticle(filterType);
        setArticles(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
      <Heading fontSize="2xl" my={4} textAlign="center">
        A website for ordering articles and news
      </Heading>
      <ArticleSearch
        searchTerm={searchTerm}
        filterType={filterType}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
      />
      <ArticleList
        articles={currentItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredArticles.length}
        paginate={paginate}
      />
    </Center>
  );
}
