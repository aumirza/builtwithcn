import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuiltWithCN - Showcase of Websites Built with shadcn/ui",
  description:
    "Discover amazing websites and applications built with shadcn/ui. Get inspired and showcase your own creations to the community.",
  keywords: [
    "shadcn/ui",
    "React",
    "Next.js",
    "Tailwind CSS",
    "UI Components",
    "Website Showcase",
  ],
  authors: [{ name: "BuiltWithCN Team" }],
  openGraph: {
    title: "BuiltWithCN - Showcase of Websites Built with shadcn/ui",
    description:
      "Discover amazing websites and applications built with shadcn/ui",
    type: "website",
    url: "https://builtwithcn.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuiltWithCN - Showcase of Websites Built with shadcn/ui",
    description:
      "Discover amazing websites and applications built with shadcn/ui",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
