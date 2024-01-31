import React from 'react';
import './About.css'; // Ensure you have the CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h1>About Trojan Roomies</h1>
      <p>
        "Trojan Roomies" is a cloud-based platform designed for the University of Southern California (USC) community. It simplifies the process of finding compatible roommates by intelligently matching students based on courses, interests, and lifestyle preferences, fostering a conducive environment for both academic and personal growth.
      </p>

      <section className="project-details">
        <h2>Project Vision</h2>
        <p>
          Our platform aims to create harmonious shared living experiences, understanding the transient nature of student accommodations and the importance of a compatible living environment.
        </p>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <p>
          <strong>Music Compatibility Score and Dynamic Rendering:</strong> By integrating with Spotify, "Trojan Roomies" calculates a music compatibility score based on users' favorite genres. Roommate listings are dynamically ordered and displayed, with higher compatibility profiles highlighted in vibrant colors, fostering connections based on shared musical interests.
        </p>
      </section>

      <section className="team">
        <h2>The Team Behind Trojan Roomies</h2>
        <ul>
          <li><strong>Sudesh Kumar:</strong> [Role/Bio]</li>
          <li><strong>Zongdao Wen:</strong> [Role/Bio]</li>
        </ul>
      </section>

      <footer className="copyright">
        <p>&copy; {new Date().getFullYear()} Trojan Roomies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
