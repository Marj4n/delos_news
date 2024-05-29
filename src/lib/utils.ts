import { AccountType } from "@/types/account";
import bcrypt from "bcryptjs";

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
export const setStorage = (key: string, value: AccountType[]) => {
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
export const hash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param password - The plain text password
 * @param hash - The hashed password
 * @returns True if the passwords match, false otherwise
 */
export const compare = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

/**
 * Save an account to local storage
 * @param account - The account to save
 */
export const saveAccount = async (account: AccountType) => {
  account.password = await hash(account.password);
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const updatedAccounts = [...existingAccounts, account];
  setStorage("accounts", updatedAccounts);
};

/**
 * Check if an account with the same username or email already exists
 * @param account - The account to check
 * @returns An error object if a duplicate is found, null otherwise
 */
export const checkExistingAccounts = (
  account: AccountType
): { error: keyof AccountType; message: string } | null => {
  const existingAccounts = getStorage<AccountType[]>("accounts") || [];
  const isExistingUsername = existingAccounts.some(
    (acc) => acc.username === account.username
  );
  const isExistingEmail = existingAccounts.some(
    (acc) => acc.email === account.email
  );

  if (isExistingUsername) {
    return {
      error: "username",
      message: "Username already exists. Please choose a different username.",
    };
  }

  if (isExistingEmail) {
    return {
      error: "email",
      message: "Email address already exists. Please use a different email.",
    };
  }

  return null;
};

/**
 * Set a session in session storage.
 * @param account - The account to store in session.
 */
export const setSession = (account: AccountType) => {
  setStorage("user", [account]);
};

/**
 * Get the session from session storage.
 * @returns The session object or null if not found.
 */
export const getSession = (): AccountType | null => {
  const session = getStorage<AccountType[]>("user");
  return session ? session[0] : null;
};

/**
 * Remove the session from session storage.
 */
export const removeSession = () => {
  removeStorage("user");
};
