import { Flex, Input, Select } from "@chakra-ui/react";
import { OptionType } from "@/types/option";

interface ArticleSearchProps {
  searchTerm: string;
  filterType: OptionType;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ({
  searchTerm,
  filterType,
  handleSearchChange,
  handleFilterChange,
}: ArticleSearchProps) {
  return (
    <Flex mb={4} gap={4} w="100%" maxW="800px" flexDirection="row">
      <Input
        placeholder="Search for articles..."
        value={searchTerm}
        onChange={handleSearchChange}
        flex="1"
      />
      <Select value={filterType} onChange={handleFilterChange} w="auto" mt="0">
        <option value="emailed">Emailed</option>
        <option value="shared">Shared</option>
        <option value="viewed">Viewed</option>
      </Select>
    </Flex>
  );
}
