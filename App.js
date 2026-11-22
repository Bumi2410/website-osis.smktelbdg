import { useEffect } from "react";

// Preview hanya mengarahkan ke website statis (HTML/CSS/JS murni) di public/OSIS-SMK-TELKOM
export default function App() {
  useEffect(() => {
    window.location.replace(`${process.env.PUBLIC_URL}/OSIS-SMK-TELKOM/index.html`);
  }, []);
  return null;
}
