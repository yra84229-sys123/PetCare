import { useEffect, useState } from 'react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    ownerId: '',
    petId: '',
    service: '',
    status: 'Pending',
    date: '',
    time: '',
    notes: ''
  });

  const loadData = async () => {
    if (window.PetCareDB) {
      try {
        const [allBookings, allOwners, allPets] = await Promise.all([
          window.PetCareDB.bookings.getAll(),
          window.PetCareDB.owners.getAll(),
          window.PetCareDB.pets.getAll()
        ]);
        setBookings(allBookings);
        setOwners(allOwners);
        setPets(allPets);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "Manage Appointments";
    if (desc) desc.textContent = "Schedule new services, verify logs, and update status codes.";
    
    loadData();
  }, []);

  const handleOpenModal = (booking = null) => {
    if (booking) {
      setFormData({
        id: booking.id,
        ownerId: booking.ownerId,
        petId: booking.petId,
        service: booking.service,
        status: booking.status,
        date: booking.date,
        time: booking.time,
        notes: booking.notes || ''
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultOwner = owners.length > 0 ? owners[0].id : '';
      
      setFormData({
        id: '',
        ownerId: defaultOwner,
        petId: '',
        service: '',
        status: 'Pending',
        date: tomorrow.toISOString().split('T')[0],
        time: '09:00',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerId || !formData.petId || !formData.service) {
      alert("Please complete all required fields.");
      return;
    }

    const dataToSave = {
      ownerId: formData.ownerId,
      petId: formData.petId,
      service: formData.service,
      status: formData.status,
      date: formData.date,
      time: formData.time,
      notes: formData.notes.trim()
    };

    try {
      if (formData.id) {
        const bObj = await window.PetCareDB.bookings.getById(formData.id);
        await window.PetCareDB.bookings.update(formData.id, Object.assign(bObj, dataToSave));
        alert("Appointment updated successfully!");
      } else {
        await window.PetCareDB.bookings.create(dataToSave);
        alert("Appointment booked successfully!");
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this booking?")) {
      try {
        await window.PetCareDB.bookings.delete(id);
        alert("Booking deleted.");
        loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    const owner = owners.find(o => o.id === b.ownerId);
    const pet = pets.find(p => p.id === b.petId);
    
    const ownerName = owner ? owner.name : '';
    const petName = pet ? pet.name : '';
    
    const searchString = `${b.id} ${ownerName} ${petName} ${b.service}`.toLowerCase();
    
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? b.date === dateFilter : true;
    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    
    return matchesSearch && matchesDate && matchesStatus;
  }).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

  const availablePetsForSelectedOwner = pets.filter(p => p.ownerId === formData.ownerId);

  return (
    <>
      <section className="dashboard-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i> Book Appointment
        </button>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div className="action-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by pet name, owner, service, or Booking ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <input 
              type="date" 
              className="filter-select" 
              style={{ minHeight: '48px' }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Pet</th>
                <th>Owner</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Notes Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found.</td></tr>
              ) : (
                filteredBookings.map(b => {
                  const owner = owners.find(o => o.id === b.ownerId);
                  const pet = pets.find(p => p.id === b.petId);
                  
                  let badgeClass = "badge-pending";
                  if (b.status === "Confirmed") badgeClass = "badge-confirmed";
                  if (b.status === "Completed") badgeClass = "badge-completed";
                  if (b.status === "Cancelled") badgeClass = "badge-cancelled";

                  return (
                    <tr key={b.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{b.id}</strong></td>
                      <td><strong>{pet ? pet.name : 'Unknown Pet'}</strong></td>
                      <td>{owner ? owner.name : 'Unknown Owner'}</td>
                      <td><span className="badge" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)', fontWeight: 600 }}>{b.service}</span></td>
                      <td>{b.date} <br/><small>{b.time}</small></td>
                      <td><span className={`badge ${badgeClass}`}>{b.status}</span></td>
                      <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.notes}>
                        {b.notes || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>None</span>}
                      </td>
                      <td className="table-actions">
                        <button className="btn-icon edit" title="Edit" onClick={() => handleOpenModal(b)}><i className="fas fa-pencil-alt"></i></button>
                        <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(b.id)}><i className="fas fa-trash-alt"></i></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{formData.id ? "Edit Appointment" : "Create Appointment Booking"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Owner Client *</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.ownerId}
                      onChange={e => {
                        setFormData({...formData, ownerId: e.target.value, petId: ''});
                      }}
                    >
                      <option value="" disabled>Select Owner</option>
                      {owners.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pet Patient *</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.petId}
                      onChange={e => setFormData({...formData, petId: e.target.value})}
                      disabled={!formData.ownerId}
                    >
                      <option value="" disabled>Select Pet</option>
                      {availablePetsForSelectedOwner.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Service *</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.service}
                      onChange={e => setFormData({...formData, service: e.target.value})}
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
                  <div className="form-group">
                    <label>Booking Status *</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Pending">Pending Approval</option>
                      <option value="Confirmed">Confirmed / Booked</option>
                      <option value="Completed">Service Completed</option>
                      <option value="Cancelled">Cancelled</option>
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
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Appointment Time *</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      required 
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Diagnostic / Styling Notes</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Enter special requests, allergies, behavioral notes, etc."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBookings;
