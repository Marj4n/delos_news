import { AccountType } from "@/types/account";
import { ApiResponseType } from "@/types/api";
import bcrypt from "bcryptjs";
import moment from "moment";

/**
 * Get data from local storage by key
 * @param key - The local storage key
 * @returns The parsed data or null if not found
 */
export const getStorage = <T>(key: string): T | null => {
  const storedItem = localStorage.getItem(key);
  return storedItem ? JSON.parse(storedItem) : null;
};

/**
 * Set data to local storage by key
 * @param key - The local storage key
 * @param value - The data to store
 */
export const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Remove data from local storage by key
 * @param key - The local storage key
 */
export const removeStorage = (key: string) => {
  localStorage.removeItem(key);
};

/**
 * Hash a password using bcrypt
 * @param password - The plain text password
 * @returns The hashed password
 */
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param password - The plain text password
 * @param hashedPassword - The hashed password
 * @returns True if the passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Save an account to local storage
 * @param account - The account to save
 */
export const saveAccount = async (account: AccountType) => {
  account.password = await hashPassword(account.password);
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const updatedAccounts = [...existingAccounts, account];
  setStorage("accounts", updatedAccounts);
};

/**
 * Check if an account with the same username or email already exists
 * @param account - The account to check
 * @returns An error object if a duplicate is found, null otherwise
 */
export const registerAccount = async (account: AccountType) => {
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const username = existingAccounts.find(
    (acc) => acc.username === account.username
  );
  const email = existingAccounts.find((acc) => acc.email === account.email);

  if (username) {
    return {
      error: "Username already exists. Please choose a different username.",
    };
  }

  if (email) {
    return {
      error: "Email address already exists. Please use a different email.",
    };
  }

  saveAccount(account);

  return { account };
};

/**
 * Login an account with the provided credentials
 * @param email - The email of the account
 * @param password - The plain text password
 * @returns An object containing the account if successful, or an error message
 */
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

/**
 * Set a session in local storage and update the accounts data
 * @param account - The account to store in session
 */
export const setSession = (account: AccountType) => {
  // Update the session
  setStorage("user", account);

  // Update the accounts data in local storage
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const updatedAccounts = existingAccounts.map((acc) =>
    acc.email === account.email ? account : acc
  );
  setStorage("accounts", updatedAccounts);
};

/**
 * Get the session from local storage
 * @returns The session object or null if not found
 */
export const getSession = (): AccountType | null => {
  return getStorage<AccountType>("user");
};

/**
 * Remove the session from local storage
 */
export const removeSession = () => {
  removeStorage("user");
};

/**
 * Set the selected article in local storage
 * @param article - The article to store
 */
export const setSelectedArticle = (article: ApiResponseType) => {
  setStorage("selectedArticle", article);
};

/**
 * Get the selected article from local storage
 * @returns The selected article object or null if not found
 */
export const getSelectedArticle = (): ApiResponseType | null => {
  return getStorage<ApiResponseType>("selectedArticle");
};

/**
 * Remove the selected article from local storage
 */
export const removeSelectedArticle = () => {
  removeStorage("selectedArticle");
};

/**
 * Initialize account with default values if they don't exist
 * @param account - The account to initialize
 * @returns The initialized account
 */
const initializeAccount = (account: AccountType): AccountType => {
  return {
    ...account,
    balance: account.balance ?? 100000,
    freeArticles: account.freeArticles ?? 0,
    gotJackpot: account.gotJackpot ?? false,
    luckyDraw: account.luckyDraw ?? 0,
    owned: account.owned ?? [],
    totalSpent: account.totalSpent ?? 0,
  };
};

/**
 * Buy an article and update user account
 * @param article - The article to buy
 * @param price - The price of the article
 * @returns An object containing the updated account if successful, or an error message
 */

export const buyArticle = (article: ApiResponseType, price: number) => {
  const session = getSession();
  if (!session) {
    return { error: "User not logged in." };
  }

  if (session.balance < price) {
    return { error: "Insufficient balance." };
  }

  if (session.owned.find((art) => art.id === article.id)) {
    return { error: "Article already owned." };
  }

  const updatedAccount = {
    ...session,
    balance: session.balance - price,
    owned: [...session.owned, article],
  };

  // Update session
  setSession(updatedAccount);

  // Update accounts storage
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

/**
 * Get the price of an article based on its published date
 * @param article - The article to get the price for
 * @returns The price of the article
 */
export const getPrice = (article: ApiResponseType) => {
  const now = moment().format("YYYY-MM-DD");
  const diff = moment(now).diff(moment(article.published_date), "days");
  const prices = diff <= 1 ? 50000 : diff <= 7 ? 20000 : 0;
  return prices;
};

/**
 * Get the image URL from the API response
 * @param data - The API response data
 * @returns The image URL
 */

export const getImageUrl = (data: ApiResponseType) => {
  return (
    data.media?.[0]?.["media-metadata"]?.[2]?.url ||
    data.media?.[0]?.["media-metadata"]?.[1]?.url ||
    data.media?.[0]?.["media-metadata"]?.[0]?.url ||
    ""
  );
};

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the text
 * @returns The truncated text
 */

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

/**
 * Get the articles owned by a user
 * @param userEmail - The email of the user
 * @returns An array of articles owned by the user
 */
export const getOwnedArticles = (account: AccountType): ApiResponseType[] => {
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const userAccount = existingAccounts.find(
    (acc) => acc.email === account.email
  );

  if (!userAccount) {
    return [];
  }

  return userAccount.owned;
};
