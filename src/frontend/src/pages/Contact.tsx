// Redirects to main single-page site
export default function Contact() {
  if (typeof window !== "undefined") {
    window.location.href = "/#contact";
  }
  return null;
}
