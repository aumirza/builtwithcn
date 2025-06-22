"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, LinkIcon, Github, Globe } from "lucide-react";
import Link from "next/link";
import { WEBSITE_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/contexts/authContext";
import { submitWebsite } from "@/actions/website-actions";
import { toast } from "sonner";

// Extract category values for the schema
const CATEGORY_VALUES = WEBSITE_CATEGORIES.map((cat) => cat.value) as [
  string,
  ...string[]
];

const submitWebsiteSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_.()&]+$/, "Title contains invalid characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters"),
  liveUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine((url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    }, "URL must start with http:// or https://"),
  sourceUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal(""))
    .refine((url) => {
      if (!url || url === "") return true;
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    }, "URL must start with http:// or https://"),
  imageUrl: z
    .string()
    .url("Please enter a valid image URL")
    .refine((url) => {
      return (
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) ||
        url.includes("unsplash.com") ||
        url.includes("imgur.com")
      );
    }, "Image URL must be a valid image file or from a supported image service"),
  category: z.enum(CATEGORY_VALUES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  tags: z
    .array(z.string().min(1).max(20))
    .min(1, "Please add at least one tag")
    .max(10, "Maximum 10 tags allowed")
    .refine((tags) => {
      const uniqueTags = new Set(tags.map((tag) => tag.toLowerCase()));
      return uniqueTags.size === tags.length;
    }, "Duplicate tags are not allowed"),
});

type SubmitWebsiteForm = z.infer<typeof submitWebsiteSchema>;

export function SubmitWebsiteForm() {
  const { user } = useAuth();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SubmitWebsiteForm>({
    resolver: zodResolver(submitWebsiteSchema),
    defaultValues: {
      title: "",
      description: "",
      liveUrl: "",
      sourceUrl: "",
      imageUrl: "",
      category: undefined,
      tags: [],
    },
  });

  const watchedImageUrl = form.watch("imageUrl");

  const onSubmit = async (data: SubmitWebsiteForm) => {
    if (!user) {
      form.setError("root", {
        message: "Please login to submit a website",
      });
      return;
    }

    const toastId = toast.loading("Submitting your website...");

    startTransition(async () => {
      try {
        const result = await submitWebsite({
          ...data,
          submittedBy: user.id,
        });

        if (result.success) {
          toast.success(
            "Website submitted successfully! It will be reviewed by our moderators.",
            { id: toastId }
          );
          setSubmitSuccess(true);
          form.reset();
        } else {
          throw new Error(result.error || "Failed to submit website");
        }
      } catch (error) {
        console.error("Error submitting website:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit website. Please try again.";

        toast.error(errorMessage, { id: toastId });
        form.setError("root", {
          message: errorMessage,
        });
      }
    });
  };

  if (submitSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">
              Website Submitted Successfully!
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Thank you for submitting your website. Our moderators will review
              it and publish it soon. You'll receive an email notification once
              it's approved.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => setSubmitSuccess(false)} variant="outline">
                Submit Another Website
              </Button>
              <Button asChild>
                <Link href="/">Browse Gallery</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
              <LinkIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold">Login Required</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please login to submit your website to the gallery. Join our
              community and showcase your amazing work built with shadcn/ui.
            </p>
            <Button asChild size="lg">
              <Link href="/login">Login to Submit</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Details</CardTitle>
        <CardDescription>
          Fill in the details about your website. All fields marked with * are
          required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {form.formState.errors.root && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Modern E-commerce Dashboard"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a clear and descriptive title for your website
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your website, its features, and what makes it special..."
                      rows={4}
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your website (20-500
                    characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="https://yourwebsite.com"
                          className="pl-10"
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Code URL (optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="https://github.com/username/repo"
                          className="pl-10"
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screenshot URL *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="https://example.com/screenshot.png"
                        className="pl-10"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Provide a URL to a screenshot of your website
                  </FormDescription>
                  <FormMessage />

                  {/* Image Preview */}
                  {watchedImageUrl && (
                    <div className="mt-2">
                      <img
                        src={watchedImageUrl}
                        alt="Website preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WEBSITE_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best fits your website
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags *</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Add a tag (e.g., responsive, dark-mode)"
                      maxTags={10}
                    />
                  </FormControl>
                  <FormDescription>
                    Add relevant tags to help users find your website
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Alert className="mb-4">
                <AlertDescription>
                  By submitting your website, you agree that it will be reviewed
                  by our moderators before being published. We may edit the
                  submission for clarity or accuracy.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting || isPending}
              >
                {form.formState.isSubmitting || isPending
                  ? "Submitting..."
                  : "Submit Website"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
