import PageShell from "./PageShell";
import PageHero from "./PageHero";
import Contact from "./Contact";
import { TRANSLATIONS } from "../utils";

/** Dedicated Contact page (route: #/contact) — keeps the active email/form draft. */
export default function ContactPage() {
  const t = TRANSLATIONS["en"];
  return (
    <PageShell>
      <PageHero eyebrow={t.contactPre} title={t.contactTitle} subtitle={t.contactSub} />
      <Contact lang="en" hideHeader />
    </PageShell>
  );
}
