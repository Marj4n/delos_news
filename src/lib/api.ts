import axios from "axios";
import { OptionType } from "@/types/option";
import { ApiResponseType } from "@/types/api";

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export const useArticle = async (
  option: OptionType
): Promise<ApiResponseType[]> => {
  try {
    const response = await axios.get(
      `https://api.nytimes.com/svc/mostpopular/v2/${option}/7.json?api-key=${apiKey}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};
