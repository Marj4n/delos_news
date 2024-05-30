import { Box, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import { ApiResponseType } from "@/types/api";

interface ArticleHeaderProps {
  article: ApiResponseType;
  imageUrl: string;
}

const ArticleHeader = ({ article, imageUrl }: ArticleHeaderProps) => {
  return (
    <Stack h="auto" justifyContent="space-between">
      <Box h={"400px"} bg={"gray.100"} mx={-6} mb={6} pos={"relative"}>
        <Image
          alt="blog post image"
          src={imageUrl}
          layout={"fill"}
          objectFit={"cover"}
        />
      </Box>
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
    </Stack>
  );
};

export default ArticleHeader;
