"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { ExpenseSelector } from "./ExpenseSelector";
import { TransactionSelector } from "./TransactionSelector";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 as Loader } from "lucide-react";

const FormSchema = z.object({
  description: z.string(),
  date: z.date(),
  expenseType: z.string(),
  transactionType: z.string(),
  amount: z.string(),
});

export function AddExpenseForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      expenseType: "Food",
      transactionType: "",
      amount: "0",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      let response: any = await fetch("/api/addExpense", {
        method: "POST",
        body: JSON.stringify([{ ...data, amount: parseFloat(data.amount) }]),
      });
      response = await response.json();
      console.log({ response });

      toast({
        title: response.message,
      });
      setLoading(false);
    } catch (err: any) {
      console.log({ err });
      toast({
        title: err.message,
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-4 box-border"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date <br />
              </FormLabel>
              <FormControl>
                <DatePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expenseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Type</FormLabel>
              <FormControl>
                <ExpenseSelector
                  placeholder="Select the Type of expense"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about expense"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can add remarks, <span>@mention</span> any other person or a
                memory.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Amount"
                  pattern="[0–9+-*//]*"
                  inputMode="tel"
                  {...field}
                  defaultValue={field.value}
                  value={undefined}
                  onBlur={(e) => {
                    const value = eval(e.target.value);
                    e.target.value = value ?? e.target.value;
                    field.onChange(e);
                  }}
                  onChange={undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transactionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <TransactionSelector
                  placeholder="How did you pay"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 items-center">
          <Button type="submit" disabled={loading}>
            Add Expense
          </Button>
          {loading && <Loader className="h-5 w-5 animate-spin" />}
        </div>
      </form>
    </Form>
  );
}
