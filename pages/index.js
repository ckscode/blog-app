import Image from "next/image";
import { Logo } from "../Components/Logo";
import HeroImage from "../public/hero.webp";
import Link from "next/link";
export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-blue-400 overflow-hidden">
      <Image src={HeroImage} fill alt="image" />
      <div className="relative text-white z-10 px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md">
        <Logo/>
        <p className="mb-3 ">
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link className="btn cursor-pointer" href="/post/new">
          Begin
        </Link>
      </div>
    </div>
  );
}


