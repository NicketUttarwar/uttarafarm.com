import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ginger">404</p>
      <h1 className="mt-2 text-3xl font-bold text-forest sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-earth/90">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-forest px-5 py-3 font-semibold text-cream">
        Back to home
      </Link>
    </div>
  );
}
