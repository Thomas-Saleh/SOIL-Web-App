import React from "react";

function Home() {
  return (
    <div className="header">
      <div className="image-container">
        <img src="/Soil.png" alt="SOIL Organic Food Grocer" />
        <h1 className="title">SOIL Organic Food Grocer</h1>
        <p className="description">Explore our selection of premium organic foods and nutritional advice.</p>
      </div>


      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <p>At SOIL Organic Food Grocer, we are committed to...</p>
          {/* Add more content about your values here */}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Mission</h2>
          <p>Our mission is to provide...</p>
          {/* Add more content about your mission here */}
        </div>
      </section>
    </div>
  );
}

export default Home;
