import React from 'react';
import HeroBanner from '../../components/home/HeroBanner/HeroBanner';
import HowItWorks from '../../components/home/HowItWorks/HowItWorks';
import CustomerFeedback from '../../components/home/CustomerFeedback/CustomerFeedback';

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
    </div>
  );
};

export default Home;
