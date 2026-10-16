import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import "./Testimonials.css";
import "./testimonials-ui.css";

export const metadata = {
  metadataBase: new URL("https://vidracariamontabox.vercel.app"),
  title: "Montabox — Vidraçaria e Serralheria de Alto Padrão",
  description:
    "Especializada em projetos residenciais e comerciais de luxo, unindo estética refinada e engenharia de alta performance.",
  keywords: [
    "vidraçaria",
    "serralheria de alumínio",
    "esquadrias de alumínio",
    "fachada pele de vidro",
    "guarda-corpo",
    "Jaboticabal",
    "São Paulo",
    "Painel ripado de alumínio",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Montabox — Vidraçaria e Serralheria de Alto Padrão",
    description:
      "Especializada em projetos residenciais e comerciais de luxo, unindo estética refinada e engenharia de alta performance.",
    siteName: "Montabox",
    url: "/",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/Logo-500x500.webp",
        width: 500,
        height: 500,
        alt: "Montabox — Vidraçaria e Serralheria de Alto Padrão",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Montabox — Vidraçaria e Serralheria de Alto Padrão",
    description:
      "Especializada em projetos residenciais e comerciais de luxo, unindo estética refinada e engenharia de alta performance.",
    images: ["/images/Logo-1200x630.webp"],
  },
  icons: {
    icon: {url: "/images/Favicon.webp", sizes: "48x48", type: "image/webp"},
    apple: {url: "/images/Logo-180x180.webp", sizes: "180x180", type: "image/webp"},
  },
};

const familjen = localFont({
  src: "../public/fonts/FamiljenGroteskVariable_Regular.woff2",
  variable: "--font-familjen",
  display: "swap",
  fallback: ["sans-serif"],
});

const neueHaas = localFont({
  src: "../public/fonts/NeueHaasDisplay_Roman.woff2",
  variable: "--font-neuehaas",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const ivyPrestoDisplay = localFont({
  src: "../public/fonts/ivy-presto-display-thin.woff2",
  variable: "--font-ivy-presto",
  display: "swap",
  fallback: ["serif"],
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Montabox",
  description: "Vidraçaria e Serralheria de Alto Padrão",
  telephone: "+5516981984000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Virgílio Pedro Ribeiro, 70, Planalto Itália",
    addressLocality: "Jaboticabal",
    addressRegion: "SP",
    postalCode: "14890-448",
    addressCountry: "BR",
  },
};

export default function RootLayout({children}) {
  return (
    <html lang="pt-BR" className={`${familjen.variable} ${neueHaas.variable} ${ivyPrestoDisplay.variable}`}>
      <body className="bg-[#121212] text-[#eaeaea] antialiased font-neuehaas">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}} />
        <SmoothScroll>{children}</SmoothScroll>
        <FloatingWhatsApp />
        <Preloader />
        <CookieBanner />
      </body>
    </html>
  );
}
