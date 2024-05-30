import { ApiResponseType } from "./api";

export interface AccountType {
  username: string;
  email: string;
  password: string;
  balance: number;
  freeArticles: number;
  gotJackpot: boolean;
  luckyDraw: number;
  owned: ApiResponseType[];
  totalSpent: number;
}
