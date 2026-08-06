import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useOutletContext();
  const [owner, setOwner] = useState(null);
  const [pets, setPets] = useState([]);
  
  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Pet Modal state
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [petFormData, setPetFormData] = useState({
    id: '',
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: ''
  });

  const loadData = async () => {
    if (window.PetCareDB && user) {
      try {
        const owners = await window.PetCareDB.owners.getAll();
        const currentOwner = owners.find(o => o.email.toLowerCase() === user.email.toLowerCase());
        setOwner(currentOwner);

        if (currentOwner) {
          setProfileData({
            name: currentOwner.name,
            email: user.email,
            phone: currentOwner.phone,
            address: currentOwner.address
          });

          const allPets = await window.PetCareDB.pets.getAll();
          setPets(allPets.filter(p => p.ownerId === currentOwner.id));
        } else {
          setProfileData(prev => ({ ...prev, name: user.name, email: user.email }));
        }
      } catch (error) {
        console.error("Error loading profile data", error);
      }
    }
  };

  useEffect(() => {
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "My Profile";
    if (desc) desc.textContent = "Update your personal details and manage your registered pets.";
    
    loadData();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: profileData.name.trim(),
      phone: profileData.phone.trim(),
      email: user.email,
      address: profileData.address.trim()
    };

    try {
      if (owner) {
        await window.PetCareDB.owners.update(owner.id, data);
        alert("Profile updated successfully!");
      } else {
        await window.PetCareDB.owners.create(data);
        alert("Profile created successfully!");
      }
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenPetModal = (pet = null) => {
    if (pet) {
      setPetFormData({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight
      });
    } else {
      setPetFormData({
        id: '',
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        weight: ''
      });
    }
    setIsPetModalOpen(true);
  };

  const handleClosePetModal = () => {
    setIsPetModalOpen(false);
  };

  const handlePetSubmit = async (e) => {
    e.preventDefault();
    if (!owner) return;

    const data = {
      name: petFormData.name.trim(),
      species: petFormData.species,
      breed: petFormData.breed.trim() || "Unknown",
      age: petFormData.age,
      gender: petFormData.gender,
      weight: petFormData.weight,
      ownerId: owner.id,
      photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300"
    };

    try {
      if (petFormData.id) {
        const petObj = await window.PetCareDB.pets.getById(petFormData.id);
        await window.PetCareDB.pets.update(petFormData.id, Object.assign(petObj, data));
        alert("Pet details updated!");
      } else {
        await window.PetCareDB.pets.create(data);
        alert("Pet registered!");
      }
      handleClosePetModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePet = async (id) => {
    if (window.confirm("Are you sure you want to delete this pet? Active bookings will prevent deletion.")) {
      try {
        await window.PetCareDB.pets.delete(id);
        alert("Pet deleted.");
        loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="cards-grid-3">
        {/* Personal Information */}
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Personal Information</h2>
          </div>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email Address (Login)</label>
              <input 
                type="email" 
                className="form-control" 
                disabled 
                value={profileData.email}
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                className="form-control" 
                required 
                value={profileData.phone}
                onChange={e => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea 
                className="form-control" 
                rows="3" 
                required 
                value={profileData.address}
                onChange={e => setProfileData({...profileData, address: e.target.value})}
              ></textarea>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn-primary">Save Profile Changes</button>
            </div>
          </form>
        </section>

        {/* Manage Pets */}
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>My Pets</h2>
            {owner && (
              <button className="btn-primary" onClick={() => handleOpenPetModal()} style={{ padding: '6px 12px', fontSize: '13px' }}>
                <i className="fas fa-plus"></i> Add Pet
              </button>
            )}
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Pet Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!owner ? (
                  <tr><td colSpan="2" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>Please complete your personal information to add pets.</td></tr>
                ) : pets.length === 0 ? (
                  <tr><td colSpan="2" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>No pets found. Click 'Add Pet' to register one.</td></tr>
                ) : (
                  pets.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'} alt="Pet" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <strong style={{ color: 'var(--primary)' }}>{p.name}</strong><br />
                            <small style={{ color: 'var(--text-muted)' }}>{p.species} • {p.breed} • {p.age} yrs • {p.weight} kg</small>
                          </div>
                        </div>
                      </td>
                      <td className="table-actions">
                        <button className="btn-icon edit" title="Edit" onClick={() => handleOpenPetModal(p)}><i className="fas fa-pencil-alt"></i></button>
                        <button className="btn-icon delete" title="Delete" onClick={() => handleDeletePet(p.id)}><i className="fas fa-trash-alt"></i></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Pet Modal */}
      {isPetModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{petFormData.id ? "Edit Pet Details" : "Register New Pet"}</h3>
              <button className="modal-close" onClick={handleClosePetModal}>&times;</button>
            </div>
            <form onSubmit={handlePetSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Pet Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={petFormData.name}
                    onChange={e => setPetFormData({...petFormData, name: e.target.value})}
                  />
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Species *</label>
                    <select 
                      className="form-control" 
                      required
                      value={petFormData.species}
                      onChange={e => setPetFormData({...petFormData, species: e.target.value})}
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Breed</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Golden Retriever" 
                      value={petFormData.breed}
                      onChange={e => setPetFormData({...petFormData, breed: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Age (Years) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      min="0" max="30" step="0.1" 
                      required 
                      value={petFormData.age}
                      onChange={e => setPetFormData({...petFormData, age: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender *</label>
                    <select 
                      className="form-control" 
                      required
                      value={petFormData.gender}
                      onChange={e => setPetFormData({...petFormData, gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Weight (kg) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="0" step="0.1" 
                    required 
                    value={petFormData.weight}
                    onChange={e => setPetFormData({...petFormData, weight: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={handleClosePetModal} style={{ padding: '8px 24px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 24px' }}>Save Pet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
