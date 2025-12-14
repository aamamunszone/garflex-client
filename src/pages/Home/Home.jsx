import React from 'react';
import HeroBanner from '../../components/home/HeroBanner/HeroBanner';

const Home = () => {
  return (
    <div className="space-y-20">
      <title>GarFlex | Garments Order & Production Tracker System</title>

      {/* Hero Section */}
      <section>
        <HeroBanner />
      </section>
    </div>
  );
};

export default Home;
