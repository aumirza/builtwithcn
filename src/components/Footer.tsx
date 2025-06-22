"use client";

import Link from "next/link";
import { Heart, ExternalLink, Users, Globe, Code2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
  };

  const footerSections: {
    title: string;
    links: FooterLink[];
  }[] = [
    {
      title: "Platform",
      links: [
        { label: "Browse Websites", href: "/" },
        { label: "Submit Website", href: "/submit" },
        { label: "Featured", href: "/featured" },
        { label: "Categories", href: "/categories" },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          label: "shadcn/ui Docs",
          href: "https://ui.shadcn.com",
          external: true,
        },
        { label: "Next.js", href: "https://nextjs.org", external: true },
        {
          label: "Tailwind CSS",
          href: "https://tailwindcss.com",
          external: true,
        },
        { label: "React", href: "https://react.dev", external: true },
      ],
    },
  ];

  const stats = [
    { icon: Globe, label: "Websites", value: "1,200+" },
    { icon: Users, label: "Developers", value: "5,000+" },
    { icon: Code2, label: "Components", value: "50+" },
    { icon: Heart, label: "Likes", value: "25,000+" },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t">
      {/* Main Footer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-10">
        {/* Brand Section */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">BuiltWithCN</span>
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Discover and showcase amazing websites and applications built with
              shadcn/ui. Join our community of developers creating beautiful,
              accessible interfaces.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-8">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center space-x-1 group"
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span>{link.label}</span>
                      {link.external && (
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <h4 className="font-semibold text-foreground">Our Community</h4>
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 bg-muted/50 rounded-lg border"
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="size-5 text-primary" />
                </div>
                <div className="font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub Footer */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>© {currentYear} BuiltWithCN. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>by developers, for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
