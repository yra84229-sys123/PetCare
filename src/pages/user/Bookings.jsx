import { useEffect, useState } from 'react';
import { useOutletContext, Link, useLocation } from 'react-router-dom';

const UserBookings = () => {
  const { user } = useOutletContext();
  const location = useLocation();
  const [owner, setOwner] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    petId: '',
    service: '',
    date: '',
    time: '09:00',
    notes: ''
  });

  const loadData = async () => {
    if (window.PetCareDB && user) {
      try {
        const owners = await window.PetCareDB.owners.getAll();
        const currentOwner = owners.find(o => o.email.toLowerCase() === user.email.toLowerCase());
        setOwner(currentOwner);

        if (currentOwner) {
          const allBookings = await window.PetCareDB.bookings.getAll();
          const myBookings = allBookings.filter(b => b.ownerId === currentOwner.id);
          const allPets = await window.PetCareDB.pets.getAll();
          const myPets = allPets.filter(p => p.ownerId === currentOwner.id);
          
          setBookings(myBookings);
          setPets(myPets);
        }
      } catch (error) {
        console.error("Error loading bookings data", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "My Bookings";
    if (desc) desc.textContent = "View your past and upcoming appointments, and book new services.";
    
    loadData();
  }, [user]);

  useEffect(() => {
    if (location.state?.autoOpenModal && !loading && owner) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setBookingFormData(prev => ({
        ...prev,
        date: tomorrow.toISOString().split('T')[0],
        service: location.state.selectedService || prev.service
      }));
      setIsModalOpen(true);
      
      // Clear history state to prevent reopening on reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state, loading, owner]);

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const b = await window.PetCareDB.bookings.getById(id);
        if (b) {
          b.status = "Cancelled";
          await window.PetCareDB.bookings.update(b.id, b);
          alert("Booking cancelled successfully!");
          loadData();
        }
      } catch (error) {
        alert("Error cancelling booking: " + error.message);
      }
    }
  };

  const handleOpenModal = () => {
    if (!owner) {
      alert("Please update your profile information first before booking an appointment.");
      return;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setBookingFormData({
      ...bookingFormData,
      date: tomorrow.toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!owner) return;

    const data = {
      ownerId: owner.id,
      petId: bookingFormData.petId,
      service: bookingFormData.service,
      date: bookingFormData.date,
      time: bookingFormData.time,
      status: "Pending",
      notes: bookingFormData.notes.trim()
    };

    try {
      await window.PetCareDB.bookings.create(data);
      alert("Booking request sent successfully!");
      handleCloseModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const serviceName = b.service.toLowerCase();
    const pet = pets.find(p => p.id === b.petId);
    const petName = pet ? pet.name.toLowerCase() : "";
    const term = searchTerm.toLowerCase();
    return serviceName.includes(term) || petName.includes(term) || b.id.toLowerCase().includes(term);
  }).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

  return (
    <>
      <section className="dashboard-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={handleOpenModal}>
          <i className="fas fa-plus"></i> Book Service
        </button>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div className="action-bar">
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search appointments..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Pet Name</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>Loading...</td></tr>
              ) : !owner ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>Please complete your profile first to view bookings.</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>No bookings found.</td></tr>
              ) : (
                filteredBookings.map(b => {
                  const pet = pets.find(p => p.id === b.petId);
                  let badgeClass = "badge-pending";
                  if (b.status === "Confirmed") badgeClass = "badge-confirmed";
                  if (b.status === "Completed") badgeClass = "badge-completed";
                  if (b.status === "Cancelled") badgeClass = "badge-cancelled";

                  return (
                    <tr key={b.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{b.id}</strong></td>
                      <td><strong>{pet ? pet.name : 'Unknown Pet'}</strong></td>
                      <td><span className="badge" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)', fontWeight: 600 }}>{b.service}</span></td>
                      <td>{b.date} {b.time}</td>
                      <td><span className={`badge ${badgeClass}`}>{b.status}</span></td>
                      <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.notes || ''}>
                        {b.notes || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>None</span>}
                      </td>
                      <td className="table-actions">
                        {(b.status === 'Pending' || b.status === 'Confirmed') && (
                          <button className="btn-icon delete" title="Cancel Booking" onClick={() => handleCancelBooking(b.id)}>
                            <i className="fas fa-times-circle"></i> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Request Appointment</h3>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleBookingSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select Pet *</label>
                  <select 
                    className="form-control" 
                    required 
                    value={bookingFormData.petId}
                    onChange={(e) => setBookingFormData({...bookingFormData, petId: e.target.value})}
                  >
                    <option value="" disabled>Select Pet</option>
                    {pets.length === 0 ? (
                      <option value="" disabled>No pets found. Please update profile.</option>
                    ) : (
                      pets.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                      ))
                    )}
                  </select>
                  <small style={{ display: 'block', marginTop: '5px', color: 'var(--text-muted)' }}>
                    Don't see your pet? <Link to="/user/profile">Update your profile</Link> to add pets.
                  </small>
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Service *</label>
                    <select 
                      className="form-control" 
                      required
                      value={bookingFormData.service}
                      onChange={(e) => setBookingFormData({...bookingFormData, service: e.target.value})}
                    >
                      <option value="" disabled>Select Service</option>
                      <option value="Physical Exam">Physical Exam</option>
                      <option value="Dental Care">Dental Care</option>
                      <option value="Flea and Tick Control">Flea and Tick Control</option>
                      <option value="Pet Nutrition">Pet Nutrition</option>
                      <option value="Pet Food">Pet Food</option>
                      <option value="Pet Accessories">Pet Accessories</option>
                      <option value="Health Products">Health Products</option>
                      <option value="Pet Adoption">Pet Adoption</option>
                      <option value="Training Supplies">Training Supplies</option>
                      <option value="Pet Grooming">Pet Grooming</option>
                      <option value="Warm Bathing">Warm Bathing</option>
                      <option value="Pet Vaccination">Pet Vaccination</option>
                      <option value="Pet Boarding">Pet Boarding</option>
                    </select>
                  </div>
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Appointment Date *</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      required 
                      value={bookingFormData.date}
                      onChange={(e) => setBookingFormData({...bookingFormData, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Appointment Time *</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      required 
                      value={bookingFormData.time}
                      onChange={(e) => setBookingFormData({...bookingFormData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Enter special requests, allergies, behavioral notes, etc."
                    value={bookingFormData.notes}
                    onChange={(e) => setBookingFormData({...bookingFormData, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={handleCloseModal} style={{ padding: '8px 24px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 24px' }}>Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserBookings;
