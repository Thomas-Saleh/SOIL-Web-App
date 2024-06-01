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

      <div className="flex justify-center mt-8">
        <section className="w-5/6 bg-white rounded-lg overflow-hidden shadow-md mx-4 mb-5"> 
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold mb-2">Premium Quality</h2>
            <p>We ensure the highest quality products to offer you the finest organic experience.</p>
          </div>
          <img src="Premium Vegetable.jpeg" alt="Premium Quality" className="w-full" />
        </section>
      </div>

      <div className="flex justify-center mt-8">
        <section className="w-1/3 bg-white rounded-lg overflow-hidden shadow-md mx-4 mb-5"> {/* Adjusted width */}
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold mb-2">Our Mission</h2>
            <p>Our mission is to provide accessible organic food options, educational resources, and support for local producers.</p>
          </div>
          <img src="Happy Eating.jpeg" alt="Our Mission" className="w-full" />
        </section>

        <section className="w-1/3 bg-white rounded-lg overflow-hidden shadow-md mx-4 mb-5"> {/* Adjusted width */}
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold mb-2">Our Values</h2>
            <p>We are committed to providing the highest quality organic products, supporting sustainable farming practices, promoting community health and wellness, encouraging balanced nutrition, and minimizing our environmental footprint.</p>
          </div>
          <img src="Our Values.jpeg" alt="Our Values" className="w-full" />
        </section>
      </div>
    </div>
  );
}

export default Home;
