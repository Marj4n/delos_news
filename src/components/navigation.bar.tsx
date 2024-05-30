"use client";

import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Heading,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { removeSelectedArticle, removeSession } from "@/lib/utils";
import { useUser } from "@/context/userContext";

export default function () {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, setUser } = useUser();

  return (
    <Box
      bg={useColorModeValue("gray.200", "gray.900")}
      px={4}
      as="header"
      position="sticky"
      top={0}
      w="100%"
      zIndex={1000}
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Delos Logo"
            width={150}
            height={150}
            priority
          />
        </Link>

        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={4}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? (
                <MoonIcon color="blue.300" />
              ) : (
                <SunIcon color="yellow.300" />
              )}
            </Button>

            {!user ? (
              <Button colorScheme={"blue"} variant={"solid"}>
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={
                      "https://api.dicebear.com/8.x/lorelei/svg?seed=Lola?backgroundColor=b6e3f4,c0aede,d1d4f9"
                    }
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={
                        "https://api.dicebear.com/8.x/lorelei/svg?seed=Lola?backgroundColor=b6e3f4,c0aede,d1d4f9"
                      }
                    />
                  </Center>
                  <br />
                  <Flex flexDir="column" align="center">
                    <p>{user.username}</p>
                    <Heading size="sm">{user.email}</Heading>
                    <p>Balance: ${user.balance.toLocaleString("id-ID")}</p>
                  </Flex>
                  <br />
                  <MenuDivider />
                  <MenuItem as={Link} href="/collection">
                    Collection
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      removeSession();
                      setUser(null);
                      removeSelectedArticle();
                      window.location.reload();
                    }}
                    as={"button"}
                    _hover={{ color: "red.400" }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
