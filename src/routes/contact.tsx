import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SCHOOL } from "@/lib/school-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — BBC Motors Driving School" },
      { name: "description", content: "Call, email or visit BBC Motors Driving School in Karimganj, Assam to enrol." },
      { property: "og:title", content: "Contact BBC Motors Driving School" },
      { property: "og:description", content: "Get in touch to enrol in a driving course in Karimganj." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  return (
    <SiteLayout>
      <PageIntro eyebrow="Contact" title="Contact Us">
        Visit our office or send us a message and we'll call you back.
      </PageIntro>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-5">
          {[
            { icon: MapPin, label: "Address", value: SCHOOL.address },
            { icon: Phone, label: "Phone", value: SCHOOL.phones.join(" / ") },
            { icon: Mail, label: "Email", value: SCHOOL.email },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-4 rounded-2xl border bg-card p-5 shadow-card">
              <Icon className="h-6 w-6 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-sm text-muted-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          className="space-y-4 rounded-2xl border bg-card p-6 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            setTimeout(() => {
              setSending(false);
              (e.target as HTMLFormElement).reset();
              toast.success("Thanks! We'll call you back soon.");
            }, 600);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" rows={5} placeholder="Which course are you interested in?" />
          </div>
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
