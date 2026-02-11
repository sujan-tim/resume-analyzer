import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { useEffect } from "react";
import { usePuterStore } from "./lib/puter";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { init }  = usePuterStore();
  useEffect(() => {
    init()
  },[init]);
  const { error } = usePuterStore();
  useEffect(() => {
    // Helpful for debugging Puter SDK load/auth issues in the browser console
    // (prints SDK object and any error from the store)
    // Open DevTools Console to see this output when reproducing the problem.
    // Remove this logging when debugging is complete.
    // eslint-disable-next-line no-console
    console.log("window.puter:", (typeof window !== 'undefined' && (window as any).puter) || null);
    if (error) {
      // eslint-disable-next-line no-console
      console.error("Puter store error:", error);
    }
  }, [error]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>

        <script src="https://js.puter.com/v2/"></script>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded">
              <strong>Puter error:</strong> {error}
            </div>
          </div>
        )}
 
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
