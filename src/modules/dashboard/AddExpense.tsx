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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("this is calling");

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  console.log({ form, values: form.getValues() });

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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Amount"
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
                You can add remarks or <span>@mention</span> any other person or
                memory.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Expense</Button>
      </form>
    </Form>
  );
}
