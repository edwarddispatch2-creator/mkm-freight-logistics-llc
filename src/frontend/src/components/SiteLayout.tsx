import { useEffect, useState } from "react";
import FAQ from "../pages/FAQ";
import HomePage from "../pages/Home";
import Footer from "./Footer";
import Header from "./Header";

type Route = "home" | "faq";

function getRoute(): Route {
  const path = window.location.pathname;
  if (path === "/faq" || path === "/faq/") return "faq";
  return "home";
}

export default function SiteLayout() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const onPopState = () => setRoute(getRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Expose navigate globally so Header/Footer can change routes
  // setRoute is stable (from useState), no dependency needed
  useEffect(() => {
    (window as Window & { __mkmNavigate?: (r: Route) => void }).__mkmNavigate =
      setRoute;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header currentRoute={route} />
      <main className="flex-1">
        {route === "faq" && <FAQ />}
        {route === "home" && <HomePage />}
      </main>
      <Footer currentRoute={route} />
    </div>
  );
}
