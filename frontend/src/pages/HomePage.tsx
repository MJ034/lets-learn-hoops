import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLearningModules } from "../hooks/useLearningModules";

export default function HomePage() {
  const { user, status } = useAuth();
  const isAuthenticated = status === "authenticated" && user !== null;
  const { modules, loading: modulesLoading, error: modulesError } = useLearningModules(undefined, {
    enabled: isAuthenticated,
  });

  if (status === "idle" || status === "loading") {
    return (
      <section className="home-page" aria-live="polite">
        <div className="home-hero">
          <div className="home-copy">
            <p className="eyebrow">Lets Learn Hoops</p>
            <h1>Loading your court...</h1>
          </div>
          <HeroVisual label="Lessons" value="--" />
        </div>
      </section>
    );
  }

  if (status === "authenticated" && user) {
    const lessonTeasers = modules.slice(0, 2);

    return (
      <section className="home-page">
        <div className="home-hero">
          <div className="home-copy">
            <p className="eyebrow">Welcome back</p>
            <h1>{user.name}, ready to keep learning?</h1>
            <p className="home-intro">
              Sharpen your understanding of the game with quick lessons built for
              players, coaches, and fans.
            </p>
          </div>
          <HeroVisual label="Lessons ready" value={modulesLoading ? "--" : String(modules.length)} />
        </div>
        <section className="lesson-teaser" aria-labelledby="lesson-teaser-title">
          <h2 id="lesson-teaser-title">Start learning</h2>
          {modulesLoading ? (
            <p>Loading lessons...</p>
          ) : modulesError ? (
            <p>{modulesError}</p>
          ) : lessonTeasers.length > 0 ? (
            <ul className="lesson-list">
              {lessonTeasers.map((module) => (
                <li key={module.id}>
                  <Link to="/learn">
                    <span>{module.title}</span>
                    <small>{module.category_name}</small>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Lessons are coming soon.</p>
          )}
        </section>
        <Link className="primary-link" to="/learn">
          View all lessons
        </Link>
      </section>
    );
  }

  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">Basketball, explained</p>
          <h1>Welcome to Let's Learn Hoops</h1>
          <p className="home-intro">
            Basketball, one lesson at a time. Build your understanding with clear,
            approachable lessons on rules, fundamentals, quizzes, and fun facts.
          </p>
        </div>
        <HeroVisual label="Foundation" value="01" />
      </div>
      <div className="home-actions">
        <Link className="primary-link" to="/register">
          Get started
        </Link>
        <Link className="secondary-link" to="/login">
          Log in
        </Link>
      </div>
    </section>
  );
}

type HeroVisualProps = {
  label: string;
  value: string;
};

function HeroVisual({ label, value }: HeroVisualProps) {
  return (
    <aside className="hero-visual" aria-label={label}>
      <div className="court-wireframe" aria-hidden="true">
        <span className="court-arc" />
        <span className="court-key" />
        <span className="court-line" />
      </div>
      <div className="hero-stat">
        <span>{value}</span>
        <small>{label}</small>
      </div>
    </aside>
  );
}