import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, HStack, Icon } from "@chakra-ui/react";

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

export default function ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
}: PaginationProps) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      paginate(currentPage + 1);
    }
  };

  return (
    <HStack spacing={4} mt={4}>
      <Button
        onClick={handlePreviousPage}
        leftIcon={<Icon as={ChevronLeftIcon} />}
        isDisabled={currentPage === 1}
      >
        Previous
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          colorScheme={currentPage === number ? "blue" : "gray"}
          onClick={() => paginate(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        onClick={handleNextPage}
        rightIcon={<Icon as={ChevronRightIcon} />}
        isDisabled={currentPage === pageNumbers.length}
      >
        Next
      </Button>
    </HStack>
  );
}
