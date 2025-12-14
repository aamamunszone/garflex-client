import React from 'react';
import HeroBanner from '../../components/home/HeroBanner/HeroBanner';
import HowItWorks from '../../components/home/HowItWorks/HowItWorks';
import CustomerFeedback from '../../components/home/CustomerFeedback/CustomerFeedback';
import KeyAdvantages from '../../components/home/KeyAdvantages/KeyAdvantages';

const Home = () => {
  return (
    <div className="space-y-20">
      <title>GarFlex | Garments Order & Production Tracker System</title>

      {/* Hero Section */}
      <section>
        <HeroBanner />
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
    </div>
  );
};

export default Home;
