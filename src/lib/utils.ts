import { AccountType } from "@/types/account";
import { ApiResponseType } from "@/types/api";
import bcrypt from "bcryptjs";
import moment from "moment";

// Storage Utility Functions
export const getStorage = <T>(key: string): T | null => {
  const storedItem = localStorage.getItem(key);
  return storedItem ? JSON.parse(storedItem) : null;
};

export const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = (key: string) => {
  localStorage.removeItem(key);
};

// Password Utility Functions
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

// Account Utility Functions
export const saveAccount = async (account: AccountType) => {
  account.password = await hashPassword(account.password);
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  setStorage("accounts", [...existingAccounts, account]);
};

export const registerAccount = async (account: AccountType) => {
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const usernameExists = existingAccounts.some(
    (acc) => acc.username === account.username
  );
  const emailExists = existingAccounts.some(
    (acc) => acc.email === account.email
  );

  if (usernameExists) {
    return {
      error: "Username already exists. Please choose a different username.",
    };
  }

  if (emailExists) {
    return {
      error: "Email address already exists. Please use a different email.",
    };
  }

  await saveAccount(account);
  return { account };
};

export const loginAccount = async (email: string, password: string) => {
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const account = existingAccounts.find((acc) => acc.email === email);

  if (!account) {
    return { error: "Email address not found. Please register first." };
  }

  const isPasswordCorrect = await comparePassword(password, account.password);
  if (!isPasswordCorrect) {
    return { error: "Incorrect password." };
  }

  const initializedAccount = initializeAccount(account);
  setSession(initializedAccount);

  return { account: initializedAccount };
};

export const setSession = (account: AccountType) => {
  setStorage("user", account);
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const updatedAccounts = existingAccounts.map((acc) =>
    acc.email === account.email ? account : acc
  );
  setStorage("accounts", updatedAccounts);
};

export const getSession = (): AccountType | null =>
  getStorage<AccountType>("user");

export const removeSession = () => removeStorage("user");

// Article Utility Functions
export const setSelectedArticle = (article: ApiResponseType) =>
  setStorage("selectedArticle", article);

export const getSelectedArticle = (): ApiResponseType | null =>
  getStorage<ApiResponseType>("selectedArticle");

export const removeSelectedArticle = () => removeStorage("selectedArticle");

// Account Initialization
const initializeAccount = (account: AccountType): AccountType => ({
  ...account,
  balance: account.balance ?? 100000,
  freeArticles: account.freeArticles ?? 0,
  gotJackpot: account.gotJackpot ?? false,
  luckyDraw: account.luckyDraw ?? 0,
  owned: account.owned ?? [],
  totalSpent: account.totalSpent ?? 0,
});

// Buying Articles
export const buyArticle = (article: ApiResponseType, price: number) => {
  const session = getSession();
  if (!session) return { error: "User not logged in." };

  if (session.balance < price) return { error: "Insufficient balance." };

  if (session.owned.some((art) => art.id === article.id))
    return { error: "Article already owned." };

  const updatedAccount = {
    ...session,
    balance: session.balance - price,
    totalSpent: session.totalSpent + price,
    owned: [...session.owned, article],
  };

  setSession(updatedAccount);

  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const accountIndex = existingAccounts.findIndex(
    (acc) => acc.email === session.email
  );

  if (accountIndex !== -1) {
    existingAccounts[accountIndex] = updatedAccount;
    setStorage("accounts", existingAccounts);
  }

  return { account: updatedAccount };
};

// Article Price Calculation
export const getPrice = (article: ApiResponseType) => {
  const now = moment().format("YYYY-MM-DD");
  const diff = moment(now).diff(moment(article.published_date), "days");
  return diff <= 1 ? 50000 : diff <= 7 ? 20000 : 0;
};

// Image URL Extraction
export const getImageUrl = (data: ApiResponseType) => {
  return (
    data.media?.[0]?.["media-metadata"]?.[2]?.url ||
    data.media?.[0]?.["media-metadata"]?.[1]?.url ||
    data.media?.[0]?.["media-metadata"]?.[0]?.url ||
    ""
  );
};

// Text Truncation
export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// Owned Articles Retrieval
export const getOwnedArticles = (account: AccountType): ApiResponseType[] => {
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const userAccount = existingAccounts.find(
    (acc) => acc.email === account.email
  );
  return userAccount?.owned || [];
};

// Lucky Draw Setup
export const setLuckDraw = (account: AccountType) => {
  if (account.totalSpent <= 50000) return { account };

  account.totalSpent -= 50000;
  account.luckyDraw = 3;

  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const accountIndex = existingAccounts.findIndex(
    (acc) => acc.email === account.email
  );

  if (accountIndex !== -1) {
    existingAccounts[accountIndex] = account;
    setStorage("accounts", existingAccounts);
    setSession(account);
  }

  return { account };
};

// Random Reward for Lucky Draw
export const getRandomReward = (hasJackpot: boolean) => {
  const rewards = [
    { display: "$20.000", value: 20000 },
    { display: "Try Again", value: 0 },
    { display: "$10.000", value: 10000 },
    { display: "$5.000", value: 5000 },
    { display: "Extra Ticket", value: 1 },
  ];

  if (!hasJackpot) {
    rewards.push({ display: "$50.000", value: 50000 });
  }

  const randomIndex = Math.floor(Math.random() * rewards.length);
  return rewards[randomIndex];
};

// Ticket Redemption for Lucky Draw
export const redeemTicket = (account: AccountType) => {
  if (account.luckyDraw <= 0) {
    return { error: "No tickets available for redemption." };
  }

  const reward = getRandomReward(account.gotJackpot);
  let updatedBalance = account.balance;
  let additionalTickets = 0;
  let gotJackpot = account.gotJackpot;

  switch (reward.display) {
    case "$50.000":
      updatedBalance += reward.value;
      gotJackpot = true;
      break;
    case "$20.000":
    case "$10.000":
    case "$5.000":
      updatedBalance += reward.value;
      break;
    case "Extra Ticket":
      additionalTickets += reward.value;
      break;
    case "Try Again":
    default:
      break;
  }

  const updatedAccount = {
    ...account,
    balance: updatedBalance,
    luckyDraw: account.luckyDraw - 1 + additionalTickets,
    gotJackpot: gotJackpot,
  };

  setSession(updatedAccount);

  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const accountIndex = existingAccounts.findIndex(
    (acc) => acc.email === account.email
  );

  if (accountIndex !== -1) {
    existingAccounts[accountIndex] = updatedAccount;
    setStorage("accounts", existingAccounts);
  }

  return { account: updatedAccount, reward: reward.display };
};
