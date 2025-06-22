import { SubmitWebsiteForm } from "@/components/SubmitWebsiteForm";

export default function SubmitPage() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Submit Your Website</h1>
          <p className="text-muted-foreground">
            Share your amazing website built with shadcn/ui with the community.
            Once submitted, our moderators will review and approve it for
            listing.
          </p>
        </div>

        <SubmitWebsiteForm />
      </div>
    </div>
  );
}
