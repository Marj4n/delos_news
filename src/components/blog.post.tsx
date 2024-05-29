"use client";

import Image from "next/image";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ApiResponseType } from "@/types/api";
import moment from "moment";

const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

export default function ({ data }: { data: ApiResponseType }) {
  const now = moment().format("YYYY-MM-DD");
  const diff = moment(now).diff(moment(data.published_date), "days");
  const prices = diff <= 1 ? 50000 : diff <= 7 ? 20000 : 0;

  const imageUrl =
    data.media?.[0]?.["media-metadata"]?.[2]?.url ||
    data.media?.[0]?.["media-metadata"]?.[1]?.url ||
    data.media?.[0]?.["media-metadata"]?.[0]?.url ||
    "";

  const truncatedAbstract = truncateText(data.abstract, 150);

  return (
    <Center py={6}>
      <Box
        cursor="pointer"
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
          transform: "scale(1.03)",
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
            <Text fontWeight={600}>
              {data.published_date} ·{" "}
              {prices > 0 ? `$${prices.toLocaleString("id-ID")}` : "Free"}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
