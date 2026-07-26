import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-2 text-gray-500">Page not found</p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;