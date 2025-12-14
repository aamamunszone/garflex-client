import React from 'react';
import HeroBanner from '../../components/home/HeroBanner/HeroBanner';
import HowItWorks from '../../components/home/HowItWorks/HowItWorks';

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
    </div>
  );
};

export default Home;
