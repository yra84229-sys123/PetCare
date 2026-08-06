import { useState } from 'react';
import { Link } from 'react-router-dom';

const Location = () => {
  const reviews = [
    {
      text: `"I had a great experience with the service pet care. They were very professional and attentive to my pet's needs."`,
      author: "Andrea Sanchez",
      avatar: "/images/1.jpg",
      puppy: "/images/3.jpg",
      stars: 5
    },
    {
      text: `"The clinic was extremely clean and the doctors were compassionate. They handled our nervous corgi with absolute care."`,
      author: "Marcus Vance",
      avatar: "/images/4.jpg",
      puppy: "/images/9.jpg",
      stars: 5
    },
    {
      text: `"Outstanding scheduling, state-of-the-art diagnostics, and clear transparency regarding pricing. Highly recommend!"`,
      author: "Clara Reynolds",
      avatar: "/images/2.jpg",
      puppy: "/images/2.jpg",
      stars: 5
    }
  ];

  const [currentReview, setCurrentReview] = useState(0);

  const handlePrev = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const review = reviews[currentReview];

  return (
    <main>
      {/* Location Banner & Description */}
      <section className="hero-image-style">
        <img src="/images/11.jpg" alt="Veterinarian examining dog" className="hero-bg-img" />
        <div className="hero-overlay">
          <div className="hero-content-wrapper">
            <p className="hero-top-text">Visit us today</p>
            <h1 className="hero-main-title">Location Hours</h1>
            <p className="hero-description">
              At PawBuddy Pet Care, we are available for appointments seven days a week! Our
              friendly team is always ready to help and provide the best care for your pets.<br /><br />
              <strong>(+855) 12 345 678</strong><br />123 Street 271, Sangkat Boeung Keng Kang, Phnom Penh
            </p>
          </div>
        </div>
      </section>

      {/* Hospital Hours Grid */}
      <section className="hours-section">
        <div className="container">
          <div className="hours-grid">
            <div className="hours-left">
              <h2>Animal Hospital Hours</h2>
              <Link to="/contact" className="make-appointment-btn">Make an appointment</Link>
            </div>
            <div className="hours-right">
              <div className="hours-table-wrap">
                <table className="hours-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Open</th>
                      <th>Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Monday to Friday</td>
                      <td>8:30 am</td>
                      <td>7:00 pm</td>
                    </tr>
                    <tr>
                      <td>Saturday</td>
                      <td>8:30 am</td>
                      <td>6:00 pm</td>
                    </tr>
                    <tr>
                      <td>Sunday</td>
                      <td>9:00 am</td>
                      <td>5:00 pm</td>
                    </tr>
                    <tr>
                      <td>Stat Holidays</td>
                      <td>Closed</td>
                      <td>Closed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overlapping Client Review Card */}
      <section className="reviews-overlap-section">
        <div className="container">
          <div className="review-overlap-card">
            <div className="review-card-left">
              <div>
                <div className="review-tag">Clients Reviews</div>
                <p className="review-text-highlight">
                  {review.text}
                </p>
              </div>
              <div>
                <div className="review-client-profile">
                  <img src={review.avatar} alt={review.author} className="review-client-avatar" />
                  <div className="review-client-details">
                    <span className="review-client-name">{review.author}</span>
                    <div className="review-stars">
                      {[...Array(review.stars)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="review-controls">
                  <button className="control-btn" onClick={handlePrev} aria-label="Previous review">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="control-btn" onClick={handleNext} aria-label="Next review">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="review-card-right">
              <img src={review.puppy} alt="Happy puppy" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Location;
