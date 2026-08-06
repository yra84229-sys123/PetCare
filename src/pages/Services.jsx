import { useState } from 'react';

// Services Data
const SERVICES_DATA = [
  {
    id: "phys-exam",
    title: "Physical Exam",
    dbName: "Health Checkup",
    description: "Complete nose to tail examination to check your pet's overall health and detect possible concerns.",
    price: "$80",
    duration: "1hr",
    bgClass: "bg-mint",
    circleColor: "bg-circle-cyan",
    dotColor: "blue-dot",
    image: "/images/s1.jpg"
  },
  {
    id: "dental-care",
    title: "Dental Care",
    dbName: "Health Checkup",
    description: "Dental examination, cleaning, polishing, and care to keep your pet's teeth healthy.",
    price: "$50",
    duration: "1hr",
    bgClass: "bg-peach",
    circleColor: "bg-circle-orange",
    dotColor: "yellow-dot",
    image: "/images/s2.jpg"
  },
  {
    id: "flea-control",
    title: "Flea and Tick Control",
    dbName: "Vaccination",
    description: "Protection and treatment products to prevent fleas, ticks, and parasites.",
    price: "$120",
    duration: "1hr",
    bgClass: "bg-yellow",
    circleColor: "bg-circle-yellow",
    dotColor: "orange-dot",
    image: "/images/s3.jpg"
  },
  {
    id: "pet-nutrition",
    title: "Pet Nutrition",
    dbName: "Health Checkup",
    description: "Balanced diet advice and nutrition plans to help your pet stay healthy.",
    price: "$100",
    duration: "1hr",
    bgClass: "bg-mint",
    circleColor: "bg-circle-cyan",
    dotColor: "blue-dot",
    image: "/images/s4.jpg"
  },
  {
    id: "pet-food",
    title: "Pet Food",
    dbName: "Pet Food",
    description: "Dry food, wet food, treats, and specialty diets for dogs and cats.",
    price: "$20",
    duration: "30min",
    bgClass: "bg-purple",
    circleColor: "bg-circle-purple",
    dotColor: "purple-dot",
    image: "/images/s5.jpg"
  },
  {
    id: "pet-accessories",
    title: "Pet Accessories",
    dbName: "Pet Accessories",
    description: "Collars, leashes, toys, cages, bedding, and other pet accessories.",
    price: "$15",
    duration: "30min",
    bgClass: "bg-peach",
    circleColor: "bg-circle-orange",
    dotColor: "yellow-dot",
    image: "/images/s6.jpg"
  },
  {
    id: "health-products",
    title: "Health Products",
    dbName: "Health Products",
    description: "Vitamins, shampoos, flea treatments, and basic first-aid supplies.",
    price: "$30",
    duration: "45min",
    bgClass: "bg-green",
    circleColor: "bg-circle-green",
    dotColor: "green-dot",
    image: "/images/s7.jpg"
  },
  {
    id: "pet-adoption",
    title: "Pet Adoption",
    dbName: "Pet Adoption",
    description: "Helping pets find loving homes through adoption support.",
    price: "Free",
    duration: "1hr",
    bgClass: "bg-blue",
    circleColor: "bg-circle-blue",
    dotColor: "blue-dot",
    image: "/images/s8.jpg"
  },
  {
    id: "training-supplies",
    title: "Training Supplies",
    dbName: "Training Supplies",
    description: "Training tools such as clickers, pads, and behavior guides.",
    price: "$10",
    duration: "30min",
    bgClass: "bg-yellow",
    circleColor: "bg-circle-yellow",
    dotColor: "orange-dot",
    image: "/images/s9.jpg"
  },
  {
    id: "pet-grooming",
    title: "Pet Grooming",
    dbName: "Pet Grooming",
    description: "Professional grooming to keep your pet's coat healthy and looking great.",
    price: "$50",
    duration: "2hr",
    bgClass: "bg-blue",
    circleColor: "bg-circle-blue",
    dotColor: "blue-dot",
    image: "/images/grooming.jpg"
  },
  {
    id: "warm-bathing",
    title: "Warm Bathing",
    dbName: "Warm Bathing",
    description: "Relaxing warm baths using high-quality pet-safe shampoos.",
    price: "$35",
    duration: "1hr",
    bgClass: "bg-pink",
    circleColor: "bg-circle-pink",
    dotColor: "red-dot",
    image: "/images/bathing.jpg"
  },
  {
    id: "pet-vaccination",
    title: "Pet Vaccination",
    dbName: "Pet Vaccination",
    description: "Essential vaccines to protect your pet from common diseases.",
    price: "$45",
    duration: "30min",
    bgClass: "bg-green",
    circleColor: "bg-circle-green",
    dotColor: "green-dot",
    image: "/images/va.jpg"
  },
  {
    id: "pet-boarding",
    title: "Pet Boarding",
    dbName: "Pet Boarding",
    description: "Safe and comfortable overnight stays for your beloved pets.",
    price: "$80",
    duration: "1 Day",
    bgClass: "bg-yellow",
    circleColor: "bg-circle-yellow",
    dotColor: "orange-dot",
    image: "/images/boarding.jpg"
  }
];

// Reviews Data
const REVIEWS_DATA = [
  {
    id: 1,
    text: "I had a great experience with the service pet care. They were very professional and attentive to my pet's needs.",
    author: "Andrea Sanchez",
    avatar: "/images/10.jpg",
    stars: 5
  },
  {
    id: 2,
    text: "The service pet care went above and beyond my expectations. Highly recommend their physical exam and dental cleaning!",
    author: "Veronica Diaz",
    avatar: "/images/2.jpg",
    stars: 5
  },
  {
    id: 3,
    text: "Our German Shepherd Rocky had an amazing flea control service. Quick, clean, and the staff was super friendly.",
    author: "Michael Chang",
    avatar: "/images/3.jpg",
    stars: 5
  }
];

function Services() {
  const [reviewIndex, setReviewIndex] = useState(0);

  // Modal State
  const [modalActive, setModalActive] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  // Form States
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");

  const nextReview = () => {
    setReviewIndex((prev) => (prev + 1) % REVIEWS_DATA.length);
  };

  const prevReview = () => {
    setReviewIndex((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length);
  };

  const openAppointmentModal = async (serviceName) => {
    setSelectedService(serviceName);
    setModalActive(true);
  };

  const closeAppointmentModal = () => {
    setModalActive(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !selectedService) {
      alert("Please fill in all required fields.");
      return;
    }
    alert("Appointment request submitted successfully!");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientNotes("");
    setModalActive(false);
  };

  return (
    <div>
      {/* Services Hero Section */}
      <main>
        <section className="hero-image-style">
          <img src="/images/HOME1.jpg" alt="Dogs resting" className="hero-bg-img" />
          <div className="hero-overlay">
            <div className="hero-content-wrapper">
              <p className="hero-top-text"></p>
              <h1 className="hero-main-title">PawBuddy of<br />Phnom Penh</h1>
              <p className="hero-description">Explore our veterinary approved checkups, hygiene bathing, vaccinations, and specialized nutrition programs to give your pet the best lifestyle possible.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Wide Services Alternating Cards */}
      <section style={{ backgroundColor: "#ffffff", padding: "40px 0" }}>
        <div className="container">
          <div className="wide-services-list">
            {SERVICES_DATA.map((service) => (
              <div key={service.id} className={`wide-service-card ${service.bgClass}`}>
                <div className="wide-service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="wide-service-price">
                    {service.duration} / {service.price}
                  </div>
                  <button
                    onClick={() => openAppointmentModal(service.title)}
                    className="btn rounded-pill px-4 py-2 mt-3 fw-bold"
                    style={{ fontSize: "14px", backgroundColor: "#f2f2f2", color: "#000000", border: "none" }}
                  >
                    Make an appointment
                  </button>
                </div>
                <div className="wide-service-graphic">
                  <div className={`wide-graphic-circle ${service.circleColor}`}></div>
                  <img src={service.image} alt={service.title} />
                  <div className={`dot-floating ${service.dotColor}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="custom-reviews-sec">
        <div className="container">
          <div className="reviews-split-grid">
            <div className="reviews-split-left">
              <h4>Customer Reviews</h4>
              <div className="review-slider-text">
                "{REVIEWS_DATA[reviewIndex].text}"
              </div>
              <div className="review-author-row">
                <div className="review-author-profile">
                  <img
                    src={REVIEWS_DATA[reviewIndex].avatar}
                    alt={REVIEWS_DATA[reviewIndex].author}
                  />
                  <div className="review-author-info">
                    <strong>{REVIEWS_DATA[reviewIndex].author}</strong>
                    <div className="stars-rating">
                      {[...Array(REVIEWS_DATA[reviewIndex].stars)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="carousel-controls">
                  <button className="carousel-btn" onClick={prevReview}>
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <button className="carousel-btn" onClick={nextReview}>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="reviews-split-right">
              <img
                src="/images/5.jpg"
                alt="Two happy puppies"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Public Appointment Booking Modal */}
      <div className={`public-booking-modal-overlay ${modalActive ? "active" : ""}`}>
        <div className="public-booking-modal-card">
          <button className="public-booking-close" onClick={closeAppointmentModal}>&times;</button>

          <div className="public-booking-split">
            {/* Left side Image of Cat and Human finger touching */}
            <div className="public-booking-img-panel">
              <img
                src="/images/6.jpg"
                alt="Black cat touching finger"
                style={{ minHeight: "450px" }}
              />
            </div>

            {/* Right side Booking Form */}
            <div className="public-booking-form-panel">
              <h3>Book an appointment</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={selectedService}
                      readOnly
                      required
                      style={{ minHeight: "48px", backgroundColor: "#f8f9fa", cursor: "not-allowed", color: "#6b7280" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Your message"
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="public-booking-btn-submit mt-3">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
