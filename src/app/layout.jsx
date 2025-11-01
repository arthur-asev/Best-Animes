import "../globals.css" // seu CSS global, pode renomear index.css para isso
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Footer from "../components/Footer";
config.autoAddCss = false; // Evita que o Font Awesome adicione CSS automaticamente

export const metadata = {
  title: "BestAnimes",
  description: "Assista seus animes favoritos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>

    </html>
  );
}
