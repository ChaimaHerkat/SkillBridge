import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Freelancer.css";

interface Freelancer {
  id: number;
  name: string;
  job: string;
  avatar: string;
  description: string;
  skills: string[];
  rating: number;
  hourlyRate: number;
  category: string;
  available: boolean;
}

const freelancers: Freelancer[] = [
  {
    id: 1,
    name: "Sarah Martin",
    job: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/300?img=47",
    description:
      "I create clean, intuitive and modern digital experiences for startups and growing businesses.",
    skills: ["UI/UX", "Figma", "Web Design"],
    rating: 4.9,
    hourlyRate: 35,
    category: "Design",
    available: true,
  },
  {
    id: 2,
    name: "Alex Johnson",
    job: "Full Stack Developer",
    avatar: "https://i.pravatar.cc/300?img=12",
    description:
      "Full-stack developer focused on React, TypeScript, Node.js and scalable web applications.",
    skills: ["React", "Node.js", "TypeScript"],
    rating: 5.0,
    hourlyRate: 50,
    category: "Development",
    available: true,
  },
  {
    id: 3,
    name: "Emma Wilson",
    job: "Digital Marketing Expert",
    avatar: "https://i.pravatar.cc/300?img=32",
    description:
      "I help businesses improve their online presence through strategic digital marketing campaigns.",
    skills: ["SEO", "Marketing", "Social Media"],
    rating: 4.8,
    hourlyRate: 30,
    category: "Marketing",
    available: true,
  },
  {
    id: 4,
    name: "Daniel Carter",
    job: "Data Scientist",
    avatar: "https://i.pravatar.cc/300?img=11",
    description:
      "Data scientist specializing in analytics, machine learning and turning complex data into insights.",
    skills: ["Python", "Machine Learning", "SQL"],
    rating: 4.9,
    hourlyRate: 45,
    category: "Data & AI",
    available: false,
  },
  {
    id: 5,
    name: "Sophia Brown",
    job: "Frontend Developer",
    avatar: "https://i.pravatar.cc/300?img=44",
    description:
      "Frontend developer building responsive and accessible interfaces with modern technologies.",
    skills: ["React", "CSS", "JavaScript"],
    rating: 4.9,
    hourlyRate: 40,
    category: "Development",
    available: true,
  },
  {
    id: 6,
    name: "Michael Davis",
    job: "Brand Designer",
    avatar: "https://i.pravatar.cc/300?img=68",
    description:
      "Creative designer helping brands build memorable identities and consistent visual systems.",
    skills: ["Branding", "Illustrator", "Photoshop"],
    rating: 4.7,
    hourlyRate: 32,
    category: "Design",
    available: true,
  },
];

const categories = [
  "All",
  "Development",
  "Design",
  "Marketing",
  "Data & AI",
];

const Freelancers: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredFreelancers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return freelancers.filter((freelancer) => {
      const matchesCategory =
        category === "All" || freelancer.category === category;

      const matchesSearch =
        !searchValue ||
        freelancer.name.toLowerCase().includes(searchValue) ||
        freelancer.job.toLowerCase().includes(searchValue) ||
        freelancer.skills.some((skill) =>
          skill.toLowerCase().includes(searchValue)
        );

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div className="freelancers-page">
      <Header />

      <main>
        {/* HERO */}
        <section className="freelancers-hero">
          <div className="freelancers-container">
            <div className="freelancers-heading">
              <span className="freelancers-label">
                EXPLORE PROFESSIONALS
              </span>

              <h1>Meet our freelancers</h1>

              <p>
                Find experienced professionals ready to work on your
                next idea and help turn your goals into reality.
              </p>
            </div>

            {/* SEARCH */}
            <div className="freelancers-search-wrapper">
              <div className="freelancers-search">
                <span className="search-icon">⌕</span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, skill or expertise..."
                  aria-label="Search freelancers"
                />

                {search && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* RESULT COUNT */}
            <div className="freelancers-count">
              <strong>{filteredFreelancers.length}</strong>
              <span>
                {filteredFreelancers.length === 1
                  ? "professional"
                  : "professionals"}
              </span>
            </div>

            {/* FILTERS */}
            <div className="freelancer-filters">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    category === item
                      ? "category-filter active"
                      : "category-filter"
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* PROFESSIONALS */}
        <section className="freelancers-results">
          <div className="freelancers-container">
            {filteredFreelancers.length > 0 ? (
              <div className="freelancers-grid">
                {filteredFreelancers.map((freelancer) => (
                  <article
                    className="freelancer-profile-card"
                    key={freelancer.id}
                  >
                    <div className="profile-card-top">
                      <div className="profile-avatar-wrapper">
                        <img
                          src={freelancer.avatar}
                          alt={freelancer.name}
                          className="profile-avatar"
                        />

                        {freelancer.available && (
                          <span
                            className="availability-dot"
                            title="Available"
                          />
                        )}
                      </div>

                      <div className="profile-heading">
                        <h2>{freelancer.name}</h2>
                        <p>{freelancer.job}</p>
                      </div>
                    </div>

                    <div className="verified-badge">
                      ✓ Verified professional
                    </div>

                    <p className="profile-description">
                      {freelancer.description}
                    </p>

                    <div className="profile-skills">
                      {freelancer.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <div className="profile-divider" />

                    <div className="profile-bottom">
                      <div className="profile-rating">
                        <span>★</span>
                        <strong>{freelancer.rating}</strong>
                      </div>

                      <div className="profile-price">
                        <strong>${freelancer.hourlyRate}</strong>
                        <span>/hr</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="profile-button"
                      onClick={() =>
                        navigate(`/freelancers/${freelancer.id}`)
                      }
                    >
                      View Profile
                      <span>→</span>
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="freelancers-empty">
                <div className="empty-icon">⌕</div>

                <h2>No professionals found</h2>

                <p>
                  Try another name, skill or category to find the right
                  professional.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="freelancers-cta">
          <div className="freelancers-cta-inner">
            <span className="freelancers-label">
              FOR FREELANCERS
            </span>

            <h2>Turn your skills into new opportunities.</h2>

            <p>
              Create your professional profile, showcase your expertise
              and connect with clients looking for your skills.
            </p>

            <button
              type="button"
              className="freelancers-cta-button"
              onClick={() => navigate("/register")}
            >
              Join SkillBridge
              <span>→</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Freelancers;