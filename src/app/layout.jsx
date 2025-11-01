import "../globals.css" // seu CSS global, pode renomear index.css para isso

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
