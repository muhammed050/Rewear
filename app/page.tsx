import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Camera,
  Heart,
  LockKeyhole,
  Check,
  MoveUpRight,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { appUrl } from "@/lib/config";
export const metadata = { alternates: { canonical: "/" } };
const faqs = [
  [
    "What is Rewear?",
    "Rewear is your digital wardrobe and outfit recreator. Upload an outfit image, add the pieces you own, and discover how to put the look together from your closet.",
  ],
  [
    "Do I need to photograph my entire closet?",
    "Start with a handful of your most-worn pieces. Add items one at a time, or use Rewear+ to identify garments from outfit photos and review them before saving.",
  ],
  [
    "Can I try it without an account?",
    "Yes. Your first outfit analysis is available before signing up. Create an account to build your closet, save your results, and get matches using clothes you own.",
  ],
  [
    "Are my photos private?",
    "Your wardrobe photos are stored privately. Public share links contain only the result details you choose to share, and you can revoke a link at any time.",
  ],
  [
    "What if I don’t own a matching piece?",
    "We clearly label the missing piece. You can try an alternative from your closet without being pushed to buy something new.",
  ],
];
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-star">✳</span> YOUR CLOSET. A FRESH
              PERSPECTIVE.
            </span>
            <h1>
              You already
              <br />
              own <em>the outfit.</em>
            </h1>
            <p className="hero-description">
              That look you saved? It might be in your closet.
              <br className="desktop" /> Drop your inspiration. We’ll help you
              rewear it.
            </p>
            <div className="actions">
              <Link className="button" href="/recreate">
                Recreate my look <Sparkles size={18} />
              </Link>
              <Link className="text-link" href="/how-it-works">
                See how it works <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="hero-note">
              <span>
                <Check size={14} /> Try your first look free
              </span>
              <span>
                <LockKeyhole size={13} /> Your closet stays private
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-top">
              <span>THE LOOK YOU SAVED</span>
              <span>THE PIECES YOU OWN</span>
            </div>
            <div className="editorial-image">
              <Image
                src="/images/editorial.webp"
                alt="Outfit inspiration with a brown jacket and jeans, beside matching garments arranged on an ivory background"
                fill
                priority
                sizes="(max-width: 800px) 94vw, 53vw"
              />
              <div className="image-label left">the inspiration</div>
              <div className="image-label right">
                your version <Sparkles size={12} />
              </div>
              <div className="art-arrow">
                <ArrowRight size={22} />
              </div>
            </div>
            <div className="match-sticker">
              <span className="match-icon">
                <Check size={23} />
              </span>
              <div>
                <strong>A whole new look.</strong>
                <span>With pieces you already love.</span>
              </div>
              <Heart size={20} />
            </div>
            <div className="art-caption">
              <span>A LITTLE INSPIRATION. ZERO NEW CLOTHES.</span>
              <span>Illustrative example · AI-created imagery</span>
            </div>
          </div>
        </section>
        <div className="brand-strip">
          <span>
            Saved it. Loved it. <i>Rewear it.</i>
          </span>
          <span>More style, less stuff.</span>
          <span>
            Your next outfit is already here. <Sparkles size={17} />
          </span>
        </div>
        <section className="section wrap" id="how-it-works">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                FROM “I WANT THAT” TO “I HAVE THAT”
              </span>
              <h2>
                Good taste.
                <br />
                <em>Already in your closet.</em>
              </h2>
            </div>
            <p>
              Your camera roll has the inspiration.
              <br />
              Your wardrobe has the possibilities.
              <br />
              We connect the two.
            </p>
          </div>
          <div className="steps">
            {[
              [
                "01",
                "Drop the inspiration",
                "A screenshot, a street-style moment, that outfit you can’t stop thinking about.",
                Camera,
              ],
              [
                "02",
                "Meet your matches",
                "We break down the look and find similar pieces in your digital closet.",
                Sparkles,
              ],
              [
                "03",
                "Make it your own",
                "Save the outfit, swap a piece, and give your old favorites a new day out.",
                Heart,
              ],
            ].map(([n, title, body, Icon]) => (
              <article key={String(n)}>
                <div className="step-number">
                  <span>{String(n)}</span>
                  {typeof Icon !== "string" && <Icon size={23} />}
                </div>
                <h3>{String(title)}</h3>
                <p>{String(body)}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="closet-feature">
          <div className="wrap split">
            <div className="closet-visual">
              <Image
                src="/images/flatlay.webp"
                alt="Brown suede jacket, cream knit, jeans, loafers and burgundy bag arranged as a capsule wardrobe"
                width={660}
                height={880}
                sizes="(max-width: 800px) 90vw, 40vw"
              />
              <span className="floating-note">
                Your wardrobe, <em>but smarter.</em> <Sparkles size={19} />
              </span>
            </div>
            <div className="feature-copy">
              <span className="eyebrow">YOUR NEW FAVORITE PLACE TO SHOP</span>
              <h2>
                It’s not a new closet.
                <br />
                It’s <em>new possibilities.</em>
              </h2>
              <p>
                The jacket you forgot about. The jeans you wear on repeat. Give
                every piece a place, and see what happens when you put them
                together.
              </p>
              <ul className="check-list">
                <li>
                  <Check /> A home for all your favorite pieces
                </li>
                <li>
                  <Check /> Find things by color, category, and mood
                </li>
                <li>
                  <Check /> Save the outfits you’ll actually wear
                </li>
              </ul>
              <Link className="button" href="/closet">
                Build my closet <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>
        <section className="section wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LESS SCROLLING. MORE WEARING.</span>
              <h2>
                A little inspiration.
                <br />
                <em>A lot more you.</em>
              </h2>
            </div>
            <Link className="text-link" href="/examples">
              Open the lookbook <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="lookbook-grid">
            {[
              [
                "The everyday edit",
                "Casual layers. Effortless repeats.",
                "/images/inspiration.webp",
                "01",
              ],
              [
                "A closet worth rediscovering",
                "Your staples, seen differently.",
                "/images/flatlay.webp",
                "02",
              ],
              [
                "Your next great rewear",
                "Save the idea. Wear your version.",
                "/images/editorial.webp",
                "03",
              ],
            ].map(([title, sub, src, n]) => (
              <Link href="/recreate" className="lookbook-card" key={title}>
                <div className="lookbook-image">
                  <Image
                    src={src}
                    alt={title + " — illustrative fashion example"}
                    fill
                    sizes="(max-width: 650px) 90vw, 30vw"
                  />
                  <span>{n} / THE REWEAR EDIT</span>
                  <div className="round-arrow">
                    <MoveUpRight size={20} />
                  </div>
                </div>
                <h3>{title}</h3>
                <p>{sub}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="plus-banner wrap">
          <div>
            <span className="eyebrow">MEET REWEAR+</span>
            <h2>
              A little more
              <br />
              <em>closet magic.</em>
            </h2>
            <p>
              More recreations. Bulk photo imports.
              <br />
              More ways to wear what’s already yours.
            </p>
            <Link href="/pricing" className="button light">
              Explore Rewear+ <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="plus-mark">
            r<span>+</span>
            <small>
              LESS BUYING.
              <br />
              MORE POSSIBILITIES.
            </small>
          </div>
        </section>
        <section className="section wrap faq">
          <div>
            <span className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</span>
            <h2>
              Let’s clear
              <br />
              <em>things up.</em>
            </h2>
          </div>
          <div>
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="final-cta">
          <span className="eyebrow">YOUR NEXT FAVORITE OUTFIT IS WAITING</span>
          <h2>
            Before you buy it.
            <br />
            <em>Try rewearing it.</em>
          </h2>
          <Link className="button" href="/recreate">
            Recreate my first look <Sparkles size={17} />
          </Link>
          <p>Start with a screenshot. See what’s possible.</p>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Rewear",
              url: appUrl,
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Web",
              description:
                "Recreate outfit inspiration using your digital wardrobe.",
            }).replace(/</g, "\\u003c"),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
