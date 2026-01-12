import React from 'react';
import HeroBanner from '../../components/home/HeroBanner/HeroBanner';
import HowItWorks from '../../components/home/HowItWorks/HowItWorks';
import CustomerFeedback from '../../components/home/CustomerFeedback/CustomerFeedback';
import KeyAdvantages from '../../components/home/KeyAdvantages/KeyAdvantages';
import PricingAndPlans from '../../components/home/PricingAndPlans/PricingAndPlans';
import OurProducts from '../../components/home/OurProducts/OurProducts';
import PerformanceMetrics from '../../components/home/PerformanceMetrics/PerformanceMetrics';
import IntegrationPartners from '../../components/home/IntegrationPartners/IntegrationPartners';
import SecurityCompliance from '../../components/home/SecurityCompliance/SecurityCompliance';
import CallToAction from '../../components/home/CallToAction/CallToAction';

const Home = () => {
  return (
    <div className="space-y-10 md:space-y-14 lg:space-y-20">
      <title>GarFlex | Garments Order & Production Tracker System</title>

      {/* Hero Section */}
      <section>
        <HeroBanner />
      </section>

      {/* OurProducts Section */}
      <section>
        <OurProducts />
      </section>

      {/* HowItWorks Section */}
      <section>
        <HowItWorks />
      </section>

      {/* CustomerFeedback Section */}
      <section>
        <CustomerFeedback />
      </section>

      {/* KeyAdvantages Section */}
      <section>
        <KeyAdvantages />
      </section>

      {/* PerformanceMetrics Section */}
      <section>
        <PerformanceMetrics />
      </section>

      {/* IntegrationPartners Section */}
      <section>
        <IntegrationPartners />
      </section>

      {/* SecurityCompliance Section */}
      <section>
        <SecurityCompliance />
      </section>

      {/* PricingAndPlans Section - Moved before CTA */}
      <section>
        <PricingAndPlans />
      </section>

      {/* CallToAction Section */}
      <section>
        <CallToAction />
      </section>
    </div>
  );
};

export default Home;
