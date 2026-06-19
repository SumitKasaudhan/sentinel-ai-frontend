import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import Hero from "@/components/marketing/hero/Hero";
import Features from "@/components/marketing/features/Features";
import Pricing from "@/components/marketing/pricing/Pricing";

import Telemetry from "@/components/dashboard/telementry/Telemetry";
import ThreatAndIntegrationsSections from "@/components/marketing/ThreatAndIntegrationsSections/ThreatAndIntegrationsSections";
// NEW IMPORTS
//import ThreatPipeline from "@/components/marketing/ThreatAndIntegrationsSections/ThreatPipeline";
//import IntegrationsAPI from "@/components/marketing/ThreatAndIntegrationsSections/IntegrationsAPI";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <Telemetry />

        <Features />

        <ThreatAndIntegrationsSections />

        <Pricing />
      </main>

      <Footer />
    </>
  );
}