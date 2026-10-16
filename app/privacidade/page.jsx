import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Privacidade from "@/components/privacidade/Privacidade";

export const metadata = {
  title: "Política de privacidade — Montabox",
  description:
    "Como a Montabox trata visita ao site, cookies de medição (GA4 e GTM) e contato. Sem formulário e sem cadastro.",
  alternates: {
    canonical: "/privacidade",
  },
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white text-black font-neuehaas">
      <Navbar />
      <Privacidade />
      <div className="bg-[#121212]">
        <Footer />
      </div>
    </div>
  );
}
