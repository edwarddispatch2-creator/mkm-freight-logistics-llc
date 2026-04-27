// Redirects to main single-page site
export default function Packages() {
  if (typeof window !== "undefined") {
    window.location.href = "/#packages";
  }
  return null;
}
