export type Expense = [
  Month,
  Date,
  ExpenseType,
  Description,
  Amount,
  TransactionType
];
export type Month = string;
export type Date = string;
export type ExpenseType = string;
export type Description = string;
export type Amount = number;
export type TransactionType = string;

export type AddExpensePayload = {
  date: string;
  expenseType: string;
  amount: number;
  description?: string;
  transactionType?: string;
};
