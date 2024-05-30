import { Center, SimpleGrid } from "@chakra-ui/react";
import PostPagination from "@/components/post.pagination";
import { ApiResponseType } from "@/types/api";
import ArticlePost from "./article.post";

interface ArticleListProps {
  articles: ApiResponseType[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
}

export default function ({
  articles,
  currentPage,
  itemsPerPage,
  totalItems,
  paginate,
}: ArticleListProps) {
  return (
    <Center minH="80vh" flexDirection="column" gap={2} p={4}>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing={6}>
        {articles.map((article) => (
          <ArticlePost data={article} key={article.id} />
        ))}
      </SimpleGrid>
      <PostPagination
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        paginate={paginate}
        currentPage={currentPage}
      />
    </Center>
  );
}
