import React from "react";

function Home() {
  return (
    <div>
      <header className="relative flex items-center justify-center h-screen bg-gray-100">
        <div className="absolute inset-0 flex">
          <div className="w-1/12 bg-gradient-to-r from-gray-300 to-transparent"></div>
          <div className="flex-grow flex justify-center items-center">
            <img src="/Soil.png" alt="SOIL Organic Food Grocer" className="object-cover w-full h-full" />
          </div>
          <div className="w-1/12 bg-gradient-to-l from-gray-300 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-2">SOIL Organic Food Grocer</h1>
          <p className="text-lg">Explore our selection of premium organic foods and nutritional advice.</p>
        </div>
      </header>

      <section className="py-8 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <p>At SOIL Organic Food Grocer, we are committed to:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Providing the highest quality organic products.</li>
            <li>Supporting sustainable and ethical farming practices.</li>
            <li>Promoting health and wellness in our community.</li>
            <li>Encouraging a balanced and nutritious diet.</li>
            <li>Minimizing our environmental footprint.</li>
          </ul>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p>Our mission is to provide:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Accessible and affordable organic food options.</li>
            <li>Educational resources on nutrition and healthy living.</li>
            <li>A welcoming and inclusive shopping experience.</li>
            <li>Support for local farmers and producers.</li>
            <li>Innovative solutions for a sustainable future.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Home;
