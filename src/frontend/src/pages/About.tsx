// Redirects to main single-page site
export default function About() {
  if (typeof window !== "undefined") {
    window.location.href = "/#about";
  }
  return null;
}
