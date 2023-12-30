import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const expenseTypes = [
  "Bills",
  "Clothes",
  "Donation",
  "Entertainment",
  "Food",
  "Fuel",
  "Gifts",
  "Groceries",
  "Healthcare",
  "Home",
  "Insurance",
  "Investment",
  "Lifestyle",
  "Medicines",
  "Miscellaneous",
  "Necessity",
  "Party",
  "Rent",
  "Travel",
  "Unexpected Expanses",
  "Wants",
];

export const transactionType = [
  "Canara Bank",
  "Cash",
  "Cred",
  "Google Pay",
  "HDFC Bank",
  "HDFC Credit Card",
  "ICICI Bank",
  "ICICI Meal Card",
  "Paid By Someone Else",
  "Paytm",
  "SBI Bank",
];
