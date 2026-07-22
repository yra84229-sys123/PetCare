// js/react.jsx
const { useState } = React;

const ProductFeatures = [
  {
    title: "Luxury Dog Drying Bag",
    description: "Our premium, super-absorbent Luxury dog drying bag makes drying your pup effortless. The thick, soft microfibres draw out moisture whilst allowing mud, sand and debris to collect in the bottom of the bag ready to shake out. It doesn't hold onto nasty smells, dirt, or hair and can be used up to 6 times between washes meaning less laundry for you.",
    subtitle: "Tackle the mess",
    image: "images/3.jpg",
    reverse: false
  },
  {
    title: "Luxury Dog Cooling Coat",
    description: "All you have to do is add water, and the super absorbent material will help keep your pup cool for up to 5 hours, even during heatwaves! There's no need to constantly re-soak plus the soft breathable fabric allows air to circulate freely even during periods of exercise, without drying stiff and uncomfortable.",
    subtitle: "Beat the heat",
    image: "images/9.jpg",
    reverse: true
  },
  {
    title: "Luxury Dog Drying Towel",
    description: "We designed our dog towels to be extra large, so they're big enough to wrap around any dog, regardless of breed. They're made from premium super absorbent woven microfibres that are especially effective at drawing out dirt. They're particularly good if your dog is prone to matting as fur doesn't stick to the material plus it dries much faster than a normal towel.",
    subtitle: "Soak it up",
    image: "images/4.jpg",
    reverse: false
  },
  {
    title: "Natural Conditioner & Detangler for Dogs",
    description: "Our anti-fungal, anti-septic and anti-bacterial detangler is a natural solution for stubborn knots. Specially formulated for dogs sensitive skin to help soften and detangle fur. Lightly scented with pure essential oils for nourishing, conditioning and deodorising results. Can be sprayed directly onto clean, dry fur to comb out tangles used as as a coat conditioner, applied to freshly washed.",
    subtitle: "Tease tangles free",
    image: "images/8.jpg",
    reverse: true
  }
];

const Testimonials = [
  {
    name: "Sharon",
    text: "Great communication from this lovely company! The coat fits well and Myfanwy doesn’t seem to mind wearing it! Now we’re ready for the hot days and I feel I can keep her cool without the drama!",
    product: "Luxury Cooling Coat"
  },
  {
    name: "Andrew",
    text: "I was sick and tired of the mud and wet being brought in the house after a dog walk and then I found Pawdaw Of London. Wow terrific 5 minutes in the bag and bone dry and clean. A must for all dog owners. Best money spent. Thank you.",
    product: "Luxury Dog Drying Bag"
  },
  {
    name: "Anne-Marie",
    text: "Love the size of these towels. I’m no longer using multiples to get the dog dry. The towels at lightweight, not taking up much space which is great for holidays and in the car. They dry quickly and wash well. Bring on the dog mess, I’m ready",
    product: "Luxury Dog Towel"
  }
];

function PawdawLandingPage() {
  return (
    <div className="pawdaw-landing" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <section className="pawdaw-hero text-center py-5" style={{ backgroundColor: '#f9f9f9', padding: '80px 0' }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#2c3e50' }}>Game-Changing Products for Pup Parents</h1>
          <p className="lead mx-auto text-secondary" style={{ maxWidth: '800px', lineHeight: '1.8' }}>
            Our collection of products are inspired by Phoebe, a very characterful Cockerpoo, whom we struggled to find good quality products to care for her coat, whilst keeping her, the car, and our home clean. Keep your pup clean, cool and smelling wonderful, whilst keeping your car and home protected.
          </p>
          <button className="btn btn-dark btn-lg mt-4 rounded-pill px-5 fw-bold shadow-sm">Shop Products Now</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="pawdaw-features py-5">
        <div className="container my-5">
          {ProductFeatures.map((feature, idx) => (
            <div className={`row align-items-center mb-5 ${feature.reverse ? 'flex-row-reverse' : ''}`} key={idx} style={{ marginBottom: '80px' }}>
              <div className="col-md-6 mb-4 mb-md-0">
                <img src={feature.image} alt={feature.title} className="img-fluid rounded shadow-lg" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </div>
              <div className="col-md-6 px-md-5">
                <h6 className="text-uppercase mb-2" style={{ color: '#1e4d8c', letterSpacing: '2px', fontWeight: '600' }}>{feature.subtitle}</h6>
                <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>{feature.title}</h2>
                <p className="text-secondary mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{feature.description}</p>
                <button className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold">Discover More</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="pawdaw-testimonials py-5" style={{ backgroundColor: '#f0f4f8' }}>
        <div className="container text-center my-5">
          <h2 className="fw-bold mb-5" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>What Pup Parents Say</h2>
          <div className="row">
            {Testimonials.map((review, idx) => (
              <div className="col-md-4 mb-4" key={idx}>
                <div className="card h-100 border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
                  <div className="card-body d-flex flex-column">
                    <div className="mb-3" style={{ color: '#f1c40f', fontSize: '1.2rem' }}>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <h5 className="card-title fw-bold mb-3">{review.product}</h5>
                    <p className="card-text text-secondary flex-grow-1" style={{ fontStyle: 'italic', lineHeight: '1.6' }}>"{review.text}"</p>
                    <div className="mt-4">
                      <strong style={{ color: '#2c3e50' }}>- {review.name}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Footer */}
      <section className="pawdaw-cta text-center py-5 text-white" style={{ backgroundColor: '#1e4d8c', padding: '80px 0' }}>
        <div className="container">
          <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Discover PawBuddy of Phnom Penh</h2>
          <p className="lead mb-4" style={{ opacity: '0.9' }}>Premium products for the ultimate care of your beloved pet.</p>
          <button className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary">Shop the Collection</button>
        </div>
      </section>
    </div>
  );
}

// Attach to window object to be rendered in index.html or other files
window.PawdawLandingPage = PawdawLandingPage;
