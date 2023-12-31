"use client";
import { Button } from "@/components/ui/button";
import { Dashboard } from "@/modules/dashboard/Dashboard";
import { useSession, getSession, signIn } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  console.log({ session });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <p>Access Denied</p>
        <Button onClick={() => signIn()}>Login</Button>
      </div>
    );
  }

  return (
    <main className="py-4 box-border">
      <Dashboard />
    </main>
  );
}
