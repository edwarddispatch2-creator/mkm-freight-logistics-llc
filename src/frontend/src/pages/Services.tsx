// Redirects to main single-page site
export default function Services() {
  if (typeof window !== "undefined") {
    window.location.href = "/#services";
  }
  return null;
}
