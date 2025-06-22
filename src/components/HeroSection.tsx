"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Heart, Users, Code, Palette } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Discover Amazing shadcn/ui Projects
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-accent-foreground">Built</span>
            <span className="text-accent-foreground">With</span>
            <span className="">CN</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Showcase your{" "}
            <span className="text-primary font-semibold">shadcn/ui</span>{" "}
            creations and discover incredible websites built by the community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="font-semibold px-8 py-3 transform transition-transform hover:scale-105"
            >
              <Code className="w-5 h-5 mr-2" />
              Explore Websites
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold px-8 py-3 transform transition-transform hover:scale-105"
            >
              <Palette className="w-5 h-5 mr-2" />
              Submit Your Project
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: <Code className="w-6 h-6" />,
                value: "500+",
                label: "Projects",
              },
              {
                icon: <Users className="w-6 h-6" />,
                value: "1.2k+",
                label: "Creators",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                bg: "",
                value: "10k+",
                label: "Likes",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                value: "24/7",
                label: "Active",
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="border-2 hover:border-primary/20 transition-colors text-center p-4"
              >
                <CardContent className="p-0">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-accent">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
