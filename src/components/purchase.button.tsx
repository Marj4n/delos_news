import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ApiResponseType } from "@/types/api";
import { buyArticle, setLuckDraw } from "@/lib/utils";
import { useUser } from "@/context/userContext";

interface PurchaseButtonProps {
  article: ApiResponseType;
  price: number;
}

const PurchaseButton = ({ article, price }: PurchaseButtonProps) => {
  const { user, setUser } = useUser();
  const [buying, setBuying] = useState(false);
  const toast = useToast();

  const handleBuyArticle = () => {
    if (!article) return;

    setBuying(true);
    const result = buyArticle(article, price);

    if (result.error) {
      toast({
        title: "Purchase failed.",
        description:
          result.error === "Article already owned."
            ? "You already own this article."
            : result.error,
        status: "error",
        position: "bottom-right",
        duration: 2000,
        isClosable: true,
      });
    } else {
      setUser(setLuckDraw(result.account!!)?.account!!);
      toast({
        title: "Purchase successful.",
        description: "You have successfully purchased the article.",
        status: "success",
        position: "bottom-right",
        duration: 2000,
        isClosable: true,
      });
    }
    setBuying(false);
  };

  return (
    <Button
      colorScheme="blue"
      variant="solid"
      isLoading={buying}
      onClick={handleBuyArticle}
    >
      Buy
    </Button>
  );
};

export default PurchaseButton;
