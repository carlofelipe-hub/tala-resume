import Image from "next/image";
import { TalaLogo } from "@/components/tala/tala-logo";
import { TalaButton } from "@/components/tala/tala-button";
import { TalaMeta } from "@/components/tala/tala-meta";
import { TalaSunBackdrop } from "@/components/tala/tala-sun-backdrop";
import { TalaRule } from "@/components/tala/tala-rule";

/* ------------------------------------------------------------------ */
/* Arrow icon for CTA                                                 */
/* ------------------------------------------------------------------ */
function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Resume preview placeholder card                                    */
/* ------------------------------------------------------------------ */
function ResumePreviewCard() {
  return (
    <div className="w-[320px] rounded-xl border border-tala-rule bg-tala-surface p-6 shadow-xl shadow-tala-ink/5">
      {/* Header */}
      <div className="mb-4">
        <div className="h-5 w-36 rounded bg-tala-ink/10 mb-2" />
        <div className="h-3 w-48 rounded bg-tala-rule" />
      </div>
      <div className="h-px bg-tala-rule mb-4" />
      {/* Experience section */}
      <div className="mb-3">
        <div className="h-3 w-20 rounded bg-tala-accent/30 mb-2" />
        <div className="h-3 w-full rounded bg-tala-rule mb-1.5" />
        <div className="h-3 w-5/6 rounded bg-tala-rule mb-1.5" />
        <div className="h-3 w-4/6 rounded bg-tala-rule" />
      </div>
      {/* Skills */}
      <div className="mb-3">
        <div className="h-3 w-14 rounded bg-tala-accent/30 mb-2" />
        <div className="flex gap-1.5 flex-wrap">
          <div className="h-5 w-16 rounded-full bg-tala-rule" />
          <div className="h-5 w-20 rounded-full bg-tala-rule" />
          <div className="h-5 w-14 rounded-full bg-tala-rule" />
          <div className="h-5 w-18 rounded-full bg-tala-rule" />
        </div>
      </div>
      {/* Education */}
      <div>
        <div className="h-3 w-20 rounded bg-tala-accent/30 mb-2" />
        <div className="h-3 w-full rounded bg-tala-rule mb-1.5" />
        <div className="h-3 w-3/5 rounded bg-tala-rule" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chat bubble overlays                                               */
/* ------------------------------------------------------------------ */
function ChatBubbleDark() {
  return (
    <div className="rounded-xl bg-tala-ink px-4 py-3 text-sm text-tala-bg/90 max-w-[300px] shadow-lg">
      <p className="leading-relaxed">
        &ldquo;You said you led a team of 12 &mdash; how much did resolution
        time drop?&rdquo;
      </p>
      <TalaMeta className="mt-2 !text-tala-faint !text-[9px]">
        TALA &middot; ACHIEVEMENT MINING
      </TalaMeta>
    </div>
  );
}

function ChatBubbleAccent() {
  return (
    <div className="rounded-xl bg-tala-accent-wash px-4 py-3 text-sm text-tala-accent-ink max-w-[280px] shadow-lg">
      <p className="leading-relaxed">
        &ldquo;Ah, from 18 hours to 11 &mdash; yung &ndash;38%, ayan
        po.&rdquo;
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* How-it-works steps                                                 */
/* ------------------------------------------------------------------ */
const steps = [
  {
    num: "01",
    title: "Kuwentuhan",
    desc: "Tala chats with you naturally, like a friend over coffee. Just talk about your work experience.",
  },
  {
    num: "02",
    title: "Mining",
    desc: "AI picks out achievements and metrics from your stories that you'd normally forget to mention.",
  },
  {
    num: "03",
    title: "Draft",
    desc: "Your answers become a polished, ATS-ready resume draft in seconds.",
  },
  {
    num: "04",
    title: "Polish",
    desc: "Fine-tune wording, swap templates, and export as PDF. Done.",
  },
];

/* ------------------------------------------------------------------ */
/* Testimonials data                                                  */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    name: "Mara Reyes",
    role: "Fresh Grad, UP Diliman",
    quote:
      "I had zero idea how to write a resume. Tala asked the right questions and pulled out wins I didn't even think counted.",
    avatar:
      "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=200&h=200&fit=crop&crop=faces&q=80",
  },
  {
    name: "Jolo Santos",
    role: "Software Engineer, Makati",
    quote:
      "The kuwentuhan format is genius. It felt like talking to a mentor, not filling out forms.",
    avatar:
      "https://images.unsplash.com/photo-1681097561932-36d0df02b379?w=200&h=200&fit=crop&crop=faces&q=80",
  },
  {
    name: "Gia Lim",
    role: "Career Switcher, Cebu",
    quote:
      "Switched from teaching to UX. Tala helped me frame my classroom skills as design research experience.",
    avatar:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=200&h=200&fit=crop&crop=faces&q=80",
  },
  {
    name: "Raf dela Cruz",
    role: "OFW, Dubai",
    quote:
      "Finally have a resume that shows what I actually did, not just my job title. Got callbacks within a week.",
    avatar:
      "https://images.unsplash.com/photo-1665224751641-8ea911ca2267?w=200&h=200&fit=crop&crop=faces&q=80",
  },
  {
    name: "Bea Villanueva",
    role: "Marketing Lead, BGC",
    quote:
      "The AI suggestions caught three repeated verbs and weak bullets I'd been blind to for years.",
    avatar:
      "https://images.unsplash.com/photo-1715882389866-85c647489319?w=200&h=200&fit=crop&crop=faces&q=80",
  },
  {
    name: "Kim Navarro",
    role: "Nurse, Davao",
    quote:
      "Took me 15 minutes instead of 3 frustrated hours. Salamat, Tala!",
    avatar:
      "https://images.unsplash.com/photo-1758600587839-56ba05596c69?w=200&h=200&fit=crop&crop=faces&q=80",
  },
];

/* ------------------------------------------------------------------ */
/* How-it-works images                                                */
/* ------------------------------------------------------------------ */
const howImages = [
  {
    src: "https://images.unsplash.com/photo-1573496546038-82f9c39f6365?w=600&h=400&fit=crop&q=80",
    alt: "Two people having a casual conversation",
  },
  {
    src: "https://images.unsplash.com/photo-1592485682080-ce097a7fa3c6?w=600&h=400&fit=crop&q=80",
    alt: "Laptop on a warm wooden desk workspace",
  },
];

/* ================================================================== */
/* Landing Page                                                       */
/* ================================================================== */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-tala-bg">
      {/* Decorative backdrop sun */}
      <TalaSunBackdrop
        size={700}
        className="top-[-120px] right-[-160px] z-0"
      />

      {/* ------- NAV ------- */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 max-w-[1440px] mx-auto">
        <TalaLogo size="md" />

        {/* Center links -- hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 text-sm text-tala-muted">
          <a href="#how" className="hover:text-tala-ink transition-colors">
            How it works
          </a>
          <a href="#" className="hover:text-tala-ink transition-colors">
            Templates
          </a>
          <a href="#" className="hover:text-tala-ink transition-colors">
            Pricing
          </a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-mono text-tala-faint tracking-wide">
            EN/FIL
          </span>
          <a
            href="/login"
            className="hidden sm:inline text-sm text-tala-muted hover:text-tala-ink transition-colors"
          >
            Log in
          </a>
          <a href="/signup">
            <TalaButton size="sm">Get started</TalaButton>
          </a>
        </div>
      </nav>

      {/* ------- HERO ------- */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-12 md:pt-20 lg:pt-28 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="max-w-[640px]">
            <TalaMeta className="mb-5">
              A resume coach built with Filipinos in mind
            </TalaMeta>

            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] tracking-tight mb-6">
              Tell your story{" "}
              <em className="text-tala-accent-ink italic">para matuloy</em>
              &mdash;
              <br className="hidden sm:block" />
              we&rsquo;ll write
              <br className="hidden sm:block" /> the r&eacute;sum&eacute;.
            </h1>

            <p className="text-base md:text-lg text-tala-muted leading-relaxed max-w-[520px] mb-8">
              Tala interviews you kuwentuhan-style, pulls out the wins
              you&rsquo;d usually forget to mention, and turns them into a
              r&eacute;sum&eacute; that lands. No blank forms. No staring at a
              cursor.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a href="/signup">
                <TalaButton size="lg" iconRight={<ArrowRight />}>
                  Start the interview
                </TalaButton>
              </a>
              <TalaButton variant="secondary" size="lg">
                Upload my r&eacute;sum&eacute;
              </TalaButton>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-tala-accent" />
                <span className="text-tala-muted">
                  <strong className="text-tala-ink font-semibold">
                    2,400+
                  </strong>{" "}
                  r&eacute;sum&eacute;s built
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-tala-accent" />
                <span className="text-tala-muted">
                  Free forever for students &amp; fresh grads
                </span>
              </span>
            </div>
          </div>

          {/* Right column -- preview with hero photo */}
          <div className="relative hidden lg:flex items-start justify-center pt-8">
            {/* Hero lifestyle photo */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1531534809446-724fcafe9e97?w=800&h=1000&fit=crop&crop=faces&q=80"
                alt="Professional working on laptop"
                fill
                className="object-cover object-center opacity-[0.08] sepia-[0.15]"
                sizes="(min-width: 1024px) 50vw, 0vw"
                priority
              />
            </div>

            {/* Grid-lines background */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, var(--tala-rule) 0px, var(--tala-rule) 1px, transparent 1px, transparent 32px)",
              }}
            />

            {/* Rotated resume card */}
            <div className="relative rotate-[-2deg] translate-y-4">
              <ResumePreviewCard />
            </div>

            {/* Chat bubbles */}
            <div className="absolute top-12 -left-4">
              <ChatBubbleDark />
            </div>
            <div className="absolute bottom-24 -right-2">
              <ChatBubbleAccent />
            </div>
          </div>
        </div>
      </section>

      {/* ------- RULE ------- */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <TalaRule />
      </div>

      {/* ------- TESTIMONIALS ------- */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <TalaMeta className="mb-3">What they&rsquo;re saying</TalaMeta>
        <h2 className="font-display text-3xl md:text-4xl tracking-tight text-tala-ink mb-10">
          Filipinos building better r&eacute;sum&eacute;s,
          <br className="hidden sm:block" />
          <em className="text-tala-accent-ink italic">one kwento at a time.</em>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-[14px] border border-tala-rule bg-tala-surface p-5 flex flex-col gap-4"
            >
              <p className="text-sm text-tala-muted leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover border border-tala-rule"
                />
                <div>
                  <p className="text-sm font-semibold text-tala-ink">
                    {t.name}
                  </p>
                  <p className="text-xs text-tala-faint">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------- RULE ------- */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <TalaRule />
      </div>

      {/* ------- HOW IT WORKS ------- */}
      <section
        id="how"
        className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24"
      >
        <TalaMeta className="mb-3">How it works</TalaMeta>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 mt-8 items-center">
          {/* Left: steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="space-y-3">
                <span className="font-mono text-xs text-tala-faint tracking-widest">
                  {step.num}
                </span>
                <h3 className="font-display text-xl tracking-tight text-tala-ink">
                  {step.title}
                </h3>
                <p className="text-sm text-tala-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right: stacked images */}
          <div className="hidden lg:flex flex-col gap-4">
            {howImages.map((img) => (
              <div
                key={img.src}
                className="relative h-[200px] rounded-[14px] overflow-hidden border border-tala-rule"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 0vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
