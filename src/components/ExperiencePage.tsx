import PageShell from "./PageShell";
import PageHero from "./PageHero";
import Experience from "./Experience";
import { TRANSLATIONS } from "../utils";

/** Dedicated Experience / Professional Timeline page (route: #/experience). */
export default function ExperiencePage() {
  const t = TRANSLATIONS["en"];
  return (
    <PageShell>
      <PageHero eyebrow={t.expPre} title={t.expTitle} subtitle={t.expSub} />
      <Experience lang="en" hideHeader />
    </PageShell>
  );
}
