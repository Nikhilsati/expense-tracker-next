"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AddExpenseForm } from "./AddExpense";

export function Dashboard() {
  return (
    <Drawer>
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Add your today&apos;s expense</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <DrawerTrigger>
            <Button variant="outline">Add</Button>
          </DrawerTrigger>
        </CardFooter>
      </Card>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Expense</DrawerTitle>
        </DrawerHeader>
        <div className="mx-auto">
          <AddExpenseForm />
        </div>
        <DrawerFooter>
          {/* <Button>Submit</Button> */}
          <DrawerClose></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
