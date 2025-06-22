"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, UserPlus } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { DemoAccounts } from "./DemoAccounts";

// Zod schemas for form validation
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: SignInForm) => {
    try {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        signInForm.setError("root", {
          message: error.message || "An error occurred during sign in",
        });
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Sign in error:", error);
      signInForm.setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleSignUp = async (data: SignUpForm) => {
    try {
      const { error } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (error) {
        signUpForm.setError("root", {
          message: error.message || "An error occurred during sign up",
        });
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Sign up error:", error);
      signUpForm.setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSignUp ? (
            <>
              <UserPlus className="h-5 w-5" />
              Sign Up
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              Sign In
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isSignUp
            ? "Create a new account to get started"
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSignUp ? (
          <Form {...signUpForm}>
            {signUpForm.formState.errors.root && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {signUpForm.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
            <form
              onSubmit={signUpForm.handleSubmit(handleSignUp)}
              className="space-y-4"
            >
              <FormField
                control={signUpForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={signUpForm.formState.isSubmitting}
              >
                {signUpForm.formState.isSubmitting
                  ? "Creating account..."
                  : "Sign Up"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...signInForm}>
            {signInForm.formState.errors.root && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {signInForm.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
            <form
              onSubmit={signInForm.handleSubmit(handleSignIn)}
              className="space-y-4"
            >
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DemoAccounts
                onFillCredentials={(email, password) => {
                  signInForm.setValue("email", email);
                  signInForm.setValue("password", password);
                }}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={signInForm.formState.isSubmitting}
              >
                {signInForm.formState.isSubmitting
                  ? "Signing in..."
                  : "Sign In"}
              </Button>
            </form>
          </Form>
        )}

        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              signInForm.reset();
              signUpForm.reset();
            }}
            className="text-sm"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
