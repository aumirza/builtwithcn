import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, Users, Globe } from "lucide-react";

export function SubmitSection() {
  const benefits = [
    {
      icon: Globe,
      title: "Global Exposure",
      description: "Reach thousands of developers worldwide",
    },
    {
      icon: Users,
      title: "Community Recognition",
      description: "Get featured in our curated collection",
    },
    {
      icon: Sparkles,
      title: "Inspire Others",
      description: "Show the power of shadcn/ui components",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to showcase your creation?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who have shared their amazing
              shadcn/ui projects with our community.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/submit">
                Submit Your Website
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="space-y-4">
                <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
