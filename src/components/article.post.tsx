import Image from "next/image";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { ApiResponseType } from "@/types/api";
import { useArticle } from "@/context/articleContext";
import { getImageUrl, getPrice, truncateText } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

const ArticlePost = ({
  data,
  owned,
}: {
  data: ApiResponseType;
  owned?: boolean;
}) => {
  const router = useRouter();
  let prices = getPrice(data);
  const free = useUser().user?.freeArticles ?? [];
  if (free) prices = 0;

  const { setArticle } = useArticle();
  const imageUrl = getImageUrl(data);
  const truncatedAbstract = truncateText(data.abstract, 150);

  const handleClick = () => {
    setArticle(data);
    router.push("/detail");
  };

  const handleVisitClick = () => {
    window.open(data.url, "_blank");
  };

  return (
    <Center py={6}>
      <Box
        onClick={owned ? undefined : handleClick}
        cursor={owned ? "default" : "pointer"}
        maxW={{ base: "full", md: "445px" }}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
        transition="all 0.3s ease-in-out"
        _hover={{
          boxShadow: "lg",
          transform: owned ? "none" : "scale(1.03)",
          borderColor: "blue.500",
          borderWidth: "1.5px",
        }}
        h="550px" // Set a fixed height for the box
      >
        <Box
          h={"210px"}
          bg={"gray.100"}
          mt={-6}
          mx={-6}
          mb={6}
          pos={"relative"}
        >
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
              {data.section}
            </Text>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              {data.title}
            </Heading>
            <Text color={"gray.500"}>{truncatedAbstract}</Text>
          </Stack>
          <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
            {!owned && (
              <Text fontWeight={600}>
                {data.published_date} ·{" "}
                {free || prices === 0
                  ? "Free"
                  : `$${prices.toLocaleString("id-ID")}`}
              </Text>
            )}
            {owned && (
              <Button
                colorScheme="blue"
                variant="solid"
                onClick={handleVisitClick}
              >
                Visit Link
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};

export default ArticlePost;
