import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import heroTalent from "../../assets/hero/hero-talent.png";
import heroFreelancer from "../../assets/hero/hero-freelancer.png";
import heroCollaboration from "../../assets/hero/hero-collaboration.png";
import heroSuccess from "../../assets/hero/hero-success.png";

import "./Home.css";

/* =========================================================
   HERO SLIDES
========================================================= */

const heroSlides = [
  {
    image: heroTalent,
    badge: "FIND TOP TALENT",
    title: "Find the right talent.",
    highlight: "For your next project.",
    description:
      "Connect with skilled professionals ready to transform your ideas into exceptional results.",
  },
  {
    image: heroFreelancer,
    badge: "FOR FREELANCERS",
    title: "Turn your skills",
    highlight: "into opportunities.",
    description:
      "Showcase your expertise, discover exciting projects and build your freelance career.",
  },
  {
    image: heroCollaboration,
    badge: "COLLABORATE",
    title: "Connect. Collaborate.",
    highlight: "Create something great.",
    description:
      "Work with talented professionals from around the world and bring ambitious ideas to life.",
  },
  {
    image: heroSuccess,
    badge: "GROW WITH SKILLBRIDGE",
    title: "Build your career.",
    highlight: "Grow your future.",
    description:
      "Complete projects, build your reputation and unlock new opportunities for your professional journey.",
  },
];

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    icon: "💻",
    title: "Web Development",
    description:
      "Build modern websites, web applications and digital platforms.",
  },
  {
    icon: "🎨",
    title: "Design & Creative",
    description:
      "Find designers for branding, UI/UX, graphics and visual identity.",
  },
  {
    icon: "📱",
    title: "Mobile Development",
    description:
      "Create powerful iOS and Android applications for your business.",
  },
  {
    icon: "📣",
    title: "Digital Marketing",
    description:
      "Grow your audience through SEO, social media and marketing.",
  },
  {
    icon: "✍️",
    title: "Writing & Translation",
    description:
      "Professional content writing, copywriting and translation services.",
  },
  {
    icon: "📊",
    title: "Business & Consulting",
    description:
      "Get expert advice to improve and grow your business.",
  },
  {
    icon: "🎬",
    title: "Video & Animation",
    description:
      "Create engaging videos, animations and professional visual content.",
  },
  {
    icon: "🤖",
    title: "AI & Data",
    description:
      "Work with experts in artificial intelligence, data and machine learning.",
  },
];

/* =========================================================
   FREELANCERS
========================================================= */

const freelancers = [
  {
    name: "Sarah Martin",
    job: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/150?img=47",
    description:
      "I create clean, modern and user-friendly digital experiences for startups and businesses.",
    tags: ["UI/UX", "Figma", "Web Design"],
    rating: "4.9",
    price: "$35/hr",
  },
  {
    name: "Alex Johnson",
    job: "Full Stack Developer",
    avatar: "https://i.pravatar.cc/150?img=12",
    description:
      "Full-stack developer specialized in React, Node.js and scalable web applications.",
    tags: ["React", "Node.js", "TypeScript"],
    rating: "5.0",
    price: "$50/hr",
  },
  {
    name: "Emma Wilson",
    job: "Digital Marketing Expert",
    avatar: "https://i.pravatar.cc/150?img=32",
    description:
      "Helping businesses increase their online presence through strategic digital marketing.",
    tags: ["SEO", "Marketing", "Social Media"],
    rating: "4.8",
    price: "$30/hr",
  },
];

/* =========================================================
   HERO CAROUSEL COMPONENT
========================================================= */

function HeroCarousel() {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((previous) => {
      return (previous + 1) % heroSlides.length;
    });
  };

  const previousSlide = () => {
    setCurrentSlide((previous) => {
      return (
        (previous - 1 + heroSlides.length) %
        heroSlides.length
      );
    });
  };

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = heroSlides[currentSlide];

  return (
    <section
      className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-carousel-container">

        {/* ================= LEFT CONTENT ================= */}

        <div
          className="hero-carousel-content"
          key={currentSlide}
        >
          <div className="hero-badge">
            <span>✦</span>
            {slide.badge}
          </div>

          <h1>
            {slide.title}
            <br />
            <span>{slide.highlight}</span>
          </h1>

          <p>{slide.description}</p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/marketplace")}
            >
              Find a Freelancer
              <span>→</span>
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/marketplace")}
            >
              Find a Project
            </button>

          </div>

          <div className="hero-trust">

            <div className="avatar-group">

              <img
                src="https://i.pravatar.cc/80?img=1"
                alt="Professional"
              />

              <img
                src="https://i.pravatar.cc/80?img=5"
                alt="Professional"
              />

              <img
                src="https://i.pravatar.cc/80?img=9"
                alt="Professional"
              />

              <img
                src="https://i.pravatar.cc/80?img=15"
                alt="Professional"
              />

            </div>

            <div>
              <strong>10,000+</strong>
              <span>
                professionals already connected
              </span>
            </div>

          </div>
        </div>

        {/* ================= RIGHT IMAGE ================= */}

        <div className="hero-carousel-visual">

          <div className="hero-carousel-glow" />

          <img
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            className="hero-slide-image"
          />

          {/* Rating Card */}

          <div className="hero-floating-card hero-rating-card">

            <div className="floating-icon">
              ⭐
            </div>

            <div>
              <strong>4.9 / 5</strong>
              <small>Average rating</small>
            </div>

          </div>

          {/* Project Card */}

          <div className="hero-floating-card hero-project-card">

            <div className="floating-icon success-icon">
              ✓
            </div>

            <div>
              <strong>Project completed</strong>
              <small>Just now</small>
            </div>

          </div>

          {/* Carousel Navigation */}

          <div className="hero-navigation">

            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous slide"
            >
              ←
            </button>

            <div className="hero-dots">

              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    index === currentSlide
                      ? "hero-dot active"
                      : "hero-dot"
                  }
                  onClick={() =>
                    setCurrentSlide(index)
                  }
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}

            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              →
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

           function Home() {
  const navigate = useNavigate();

  return (
    <div className="skillbridge-home">

      
      {/* =====================================================
          HERO
      ===================================================== */}

      <div id="home">
        <HeroCarousel />
      </div>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section
        className="categories-section"
        id="categories"
      >

        <div className="section-container">

          <div className="section-header">

            <div className="section-label">
              EXPLORE TALENT
            </div>

            <h2>
              Find the right skills
            </h2>

            <p>
              Discover talented professionals across
              different industries and expertise.
            </p>

          </div>

          <div className="categories-grid">

            {categories.map((category) => (
              <div
                className="category-card"
                key={category.title}
                onClick={() =>
                  navigate("/marketplace")
                }
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <h3>
                  {category.title}
                </h3>

                <p>
                  {category.description}
                </p>

                <div className="category-arrow">
                  Explore →
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURED FREELANCERS
      ===================================================== */}

      <section
        className="freelancers-section"
        id="freelancers"
      >

        <div className="section-container">

          <div className="section-header">

            <div className="section-label">
              TOP PROFESSIONALS
            </div>

            <h2>
              Meet talented freelancers
            </h2>

            <p>
              Work with verified professionals
              who can bring your ideas to life.
            </p>

          </div>

          <div className="freelancers-grid">

            {freelancers.map((freelancer) => (
              <div
                className="freelancer-card"
                key={freelancer.name}
              >

                <div className="freelancer-top">

                  <img
                    className="freelancer-avatar"
                    src={freelancer.avatar}
                    alt={freelancer.name}
                  />

                  <div className="freelancer-info">

                    <h3>
                      {freelancer.name}
                    </h3>

                    <p>
                      {freelancer.job}
                    </p>

                    <span className="verified">
                      ✓ Verified Professional
                    </span>

                  </div>

                </div>

                <p className="freelancer-description">
                  {freelancer.description}
                </p>

                <div className="freelancer-tags">

                  {freelancer.tags.map((tag) => (
                    <span
                      className="freelancer-tag"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}

                </div>

                <div className="freelancer-bottom">

                  <div className="freelancer-rating">
                    ★ {freelancer.rating}
                  </div>

                  <div className="freelancer-price">
                    {freelancer.price}
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-container">

          <div className="section-header">

            <div className="section-label">
              SIMPLE PROCESS
            </div>

            <h2>
              How SkillBridge works
            </h2>

            <p>
              Finding the right professional
              has never been easier.
            </p>

          </div>

          <div className="steps-grid">

            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <h3>
                Post your project
              </h3>

              <p>
                Tell us what you need and
                describe your project,
                budget and requirements.
              </p>

            </div>

            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <h3>
                Find the perfect talent
              </h3>

              <p>
                Browse verified professionals
                and compare their skills,
                ratings and experience.
              </p>

            </div>

            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <h3>
                Work & succeed
              </h3>

              <p>
                Collaborate securely,
                complete your project
                and achieve your goals.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="cta-section">

        <div className="cta-container">

          <h2>
            Ready to build something amazing?
          </h2>

          <p>
            Join thousands of professionals and
            businesses already using SkillBridge
            to connect, collaborate and grow.
          </p>

          <button
            className="cta-btn"
            onClick={() => navigate("/register")}
          >
            Get Started Today →
          </button>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footer-container">

          {/* Brand */}

          <div className="footer-brand">

            <div className="logo">
              <div className="logo-icon">
                S
              </div>

              Skill<span>Bridge</span>
            </div>

            <p>
              A modern freelance marketplace
              connecting talented professionals
              with businesses around the world.
            </p>

          </div>

          {/* Marketplace */}

          <div className="footer-column">

            <h4>
              Marketplace
            </h4>

            <a href="#categories">
              Browse Categories
            </a>

            <a href="#freelancers">
              Find Freelancers
            </a>

            <a href="#">
              Find Projects
            </a>

            <a href="#">
              Post a Project
            </a>

          </div>

          {/* Company */}

          <div className="footer-column">

            <h4>
              Company
            </h4>

            <a href="#">
              About Us
            </a>

            <a href="#">
              How It Works
            </a>

            <a href="#">
              Careers
            </a>

            <a href="#">
              Contact
            </a>

          </div>

          {/* Support */}

          <div className="footer-column">

            <h4>
              Support
            </h4>

            <a href="#">
              Help Center
            </a>

            <a href="#">
              Terms of Service
            </a>

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Community
            </a>

          </div>

        </div>

        {/* Footer Bottom */}

        <div className="footer-bottom">

          <span>
            © 2026 SkillBridge. All rights reserved.
          </span>

          <div className="footer-socials">

            <a
              href="#"
              className="footer-social"
              aria-label="LinkedIn"
            >
              in
            </a>

            <a
              href="#"
              className="footer-social"
              aria-label="Twitter"
            >
              𝕏
            </a>

            <a
              href="#"
              className="footer-social"
              aria-label="Instagram"
            >
              ◎
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
}
export default Home;