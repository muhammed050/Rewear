import Link from "next/link";
import { Brand } from "./brand";
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Brand />
          <p>
            More outfits. Less shopping.
            <br />A little more you.
          </p>
        </div>
        <div>
          <b>Make it yours</b>
          <Link href="/digital-closet">Digital closet</Link>
          <Link href="/ai-outfit-recreator">Outfit recreator</Link>
          <Link href="/outfit-planner">Outfit planner</Link>
          <Link href="/packing-list">Packing lists</Link>
        </div>
        <div>
          <b>Get inspired</b>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/examples">The lookbook</Link>
          <Link href="/blog">The journal</Link>
          <Link href="/pricing">Rewear+</Link>
        </div>
        <div>
          <b>The fine print</b>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of use</Link>
          <Link href="/settings">Your privacy controls</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Rewear</span>
        <span>Fall in love with your closet. Again.</span>
      </div>
    </footer>
  );
}
