import { Toaster } from "@/components/ui/sonner";
import SiteLayout from "./components/SiteLayout";

export default function App() {
  return (
    <>
      <SiteLayout />
      <Toaster position="top-right" richColors />
    </>
  );
}
