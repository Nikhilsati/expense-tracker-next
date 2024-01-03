"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import {
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const getStats = async () => {
  let response: any = await fetch("/api/getAnalytics", {
    method: "GET",
  });
  response = await response.json();
  return response;
};
export function Dashboard() {
  const [stats, setStats] = React.useState([
    {
      title: "This Week",
      value: 0,
      change: 0,
      changeLabel: "from last week",
    },
    {
      title: "This Month",
      value: 0,
      change: 0,
      changeLabel: "from last month",
    },
    {
      title: "All Time",
      value: 0,
    },
  ]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    getStats()
      .then((res) => {
        setStats([
          {
            title: "This Week",
            value:
              res?.response?.weekly?.total?.[
                format(startOfWeek(new Date()), "dd-MMM-yyyy")
              ] ?? 0,
            change: getChangePercentage(
              res?.response?.weekly?.total?.[
                format(startOfWeek(new Date()), "dd-MMM-yyyy")
              ] ?? 0,
              res?.response?.weekly?.total?.[
                format(startOfWeek(subWeeks(new Date(), 1)), "dd-MMM-yyyy")
              ] ?? 0
            ),
            changeLabel: "from last week",
          },
          {
            title: "This Month",
            value:
              res?.response?.monthly?.total?.[format(new Date(), "MMMM")] ?? 0,
            change: getChangePercentage(
              res?.response?.monthly?.total?.[format(new Date(), "MMMM")] ?? 0,
              res?.response?.monthly?.total?.[
                format(startOfMonth(subMonths(new Date(), 1)), "MMMM")
              ] ?? 0
            ),
            changeLabel: "from last month",
          },
          {
            title: "All Time",
            value: res?.response?.allTime?.total ?? 0,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 p-3 box-border">
        {stats.map((item, index) => (
          <OverviewCard key={index} {...item} loading={loading} />
        ))}
        <Drawer>
          <Card>
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
      </div>
    </div>
  );
}

const OverviewCard = ({
  title,
  value = 0,
  change,
  changeLabel = "",
  loading = false,
}: any) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      {loading ? (
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-6" />
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div className="text-2xl font-bold">₹{value}</div>
          {change !== undefined && (
            <p className="text-xs text-muted-foreground">
              <strong
                style={{
                  color: change > 0 ? "red" : "#16b316",
                }}
              >{`${change > 0 ? "+" : ""}${change.toLocaleString()}% `}</strong>
              {`${changeLabel}`}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

const getChangePercentage = (current: number, previous: number) =>
  parseFloat((((current - previous) / (previous || 1)) * 100).toFixed(2));
