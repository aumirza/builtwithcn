"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DemoAccount {
  email: string;
  password: string;
  role: string;
  name: string;
}

interface DemoAccountsProps {
  onFillCredentials: (email: string, password: string) => void;
}

const demoAccounts: DemoAccount[] = [
  {
    email: "admin@builtwithcn.com",
    password: "admin123",
    role: "Admin",
    name: "Admin User",
  },
  {
    email: "sarah@builtwithcn.com",
    password: "mod123",
    role: "Moderator",
    name: "Sarah Johnson",
  },
  {
    email: "john@example.com",
    password: "user123",
    role: "User",
    name: "John Doe",
  },
];

export function DemoAccounts({ onFillCredentials }: DemoAccountsProps) {
  return (
    <Card className="mt-6 bg-muted">
      <CardContent className="p-4">
        <p className="text-sm font-medium mb-3">Demo Accounts:</p>
        <div className="space-y-2">
          {demoAccounts.map((account) => (
            <Button
              key={account.email}
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto p-2 text-left hover:bg-background/80"
              onClick={() => onFillCredentials(account.email, account.password)}
            >
              <div className="text-xs w-full">
                <div className="font-medium">
                  {account.role}: {account.name}
                </div>
                <div className="text-muted-foreground mt-0.5">
                  {account.email} •{" "}
                  <code className="text-foreground">{account.password}</code>
                </div>
              </div>
            </Button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-3">
          Click any account above to fill the login form
        </div>
      </CardContent>
    </Card>
  );
}
