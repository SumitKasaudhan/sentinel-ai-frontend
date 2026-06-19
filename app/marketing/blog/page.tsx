"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/marketing/footer pages/blog.css";

type Article = {
  title: string;
  description: string;
  image: string;
  link: string;
};

type FeaturedArticle = Article & {
  category: string;
  author: string;
  date: string;
  readTime: string;
};

const FEATURED_ARTICLE: FeaturedArticle = {
  title: "OWASP Top 10 for LLM Applications: What Security Teams Must Know",
  description:
    "A practical breakdown of the most critical security risks affecting enterprise AI systems and how organizations can defend against them.",
  category: "AI Security",
  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  author: "Sentinel Research Team",
  date: "June 2026",
  readTime: "8 min read",
  link: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
};

const ARTICLES: Article[] = [
  {
    title: "MITRE ATT&CK Framework Explained",
    description:
      "Understand how security teams use ATT&CK to detect, classify and respond to threats.",
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87",
    link: "https://attack.mitre.org/",
  },
  {
    title: "Prompt Injection Attacks Explained",
    description:
      "The most overlooked threat facing modern AI applications and enterprise copilots.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    link: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
  },
  {
    title: "Zero Trust Architecture Guide",
    description:
      "Building resilient enterprise security with least privilege access controls.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    link: "https://www.nist.gov/publications/zero-trust-architecture",
  },
  {
    title: "Modern Threat Intelligence Workflows",
    description:
      "How security operations teams enrich, correlate and investigate threats.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    link: "https://www.cisa.gov/topics/cyber-threats-and-advisories",
  },
];

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export default function BlogPage() {
  const totalArticles = ARTICLES.length + 1;

  return (
    <>
      <Navbar />

      <main className="blog-page">
        <div className="blog-grid-overlay" aria-hidden="true" />

        <div className="blog-container">
          {/* HERO */}
          <section className="blog-hero">
            <span className="blog-eyebrow">
              <span className="blog-eyebrow-bracket">//</span> THREAT
              INTELLIGENCE BLOG
            </span>

            <h1>Threat intelligence for the AI era.</h1>

            <p>
              Research, security insights, attack analysis and product
              updates from the Sentinel AI team.
            </p>

            <div className="blog-hero-meta">
              <span>{totalArticles} active briefings</span>
              <span className="blog-meta-divider">/</span>
              <span>Last updated {FEATURED_ARTICLE.date}</span>
            </div>
          </section>

          {/* FEATURED */}
          <section className="blog-featured">
            <div className="blog-featured-image">
              <img src={FEATURED_ARTICLE.image} alt={FEATURED_ARTICLE.title} />
            </div>

            <div className="blog-featured-content">
              <span className="blog-tag">Featured Research</span>

              <h2>{FEATURED_ARTICLE.title}</h2>

              <p>{FEATURED_ARTICLE.description}</p>

              <div className="blog-featured-meta">
                <span>{FEATURED_ARTICLE.author}</span>
                <span className="blog-meta-divider">·</span>
                <span>{FEATURED_ARTICLE.date}</span>
                <span className="blog-meta-divider">·</span>
                <span>{FEATURED_ARTICLE.readTime}</span>
              </div>

              
              <a
                href={FEATURED_ARTICLE.link}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-read-link"
              >
                Read Article
                <ArrowUpRight size={16} />
              </a>
            </div>
          </section>

          {/* LATEST RESEARCH */}
          <section className="blog-posts">
            <div className="blog-section-head">
              <span className="blog-eyebrow">
                <span className="blog-eyebrow-bracket">01</span> LATEST
                RESEARCH
              </span>
              <h3>From the field</h3>
            </div>

            {ARTICLES.map((article, i) => (
              <a
                key={article.title}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-post-row"
              >
                <span className="blog-post-index">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="blog-post-thumb">
                  <img src={article.image} alt={article.title} />
                </div>

                <div className="blog-post-body">
                  <span className="blog-post-source">
                    {getDomain(article.link)}
                  </span>
                  <h4>{article.title}</h4>
                  <p>{article.description}</p>
                </div>

                <ArrowUpRight size={18} className="blog-post-arrow" />
              </a>
            ))}
          </section>

          {/* CTA */}
          <section className="blog-cta">
            <span className="blog-eyebrow">
              <span className="blog-eyebrow-bracket">//</span> GET STARTED
            </span>

            <h2>Start monitoring your attack surface today.</h2>

            <Link href="/auth/register" className="blog-cta-btn">
              Launch Free Scan
              <ArrowRight size={18} />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}