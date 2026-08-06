import { useEffect, useState } from 'react';

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    ownerId: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'
  });

  const loadData = async () => {
    if (window.PetCareDB) {
      try {
        const [allPets, allOwners] = await Promise.all([
          window.PetCareDB.pets.getAll(),
          window.PetCareDB.owners.getAll()
        ]);
        setPets(allPets);
        setOwners(allOwners);
      } catch (err) {
        console.error("Failed to load pets/owners", err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "Manage Pet Records";
    if (desc) desc.textContent = "Register, update, and search for pet medical profiles.";
    
    loadData();
  }, []);

  const handleOpenModal = (pet = null) => {
    if (pet) {
      setFormData({
        id: pet.id,
        name: pet.name,
        ownerId: pet.ownerId,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        photo: pet.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'
      });
    } else {
      setFormData({
        id: '',
        name: '',
        ownerId: owners.length > 0 ? owners[0].id : '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        weight: '',
        photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerId) {
      alert("Please select an owner");
      return;
    }

    const dataToSave = {
      name: formData.name.trim(),
      ownerId: formData.ownerId,
      species: formData.species,
      breed: formData.breed.trim(),
      age: formData.age,
      gender: formData.gender,
      weight: formData.weight,
      photo: formData.photo.trim()
    };

    try {
      if (formData.id) {
        const petObj = await window.PetCareDB.pets.getById(formData.id);
        await window.PetCareDB.pets.update(formData.id, Object.assign(petObj, dataToSave));
        alert("Pet updated successfully!");
      } else {
        await window.PetCareDB.pets.create(dataToSave);
        alert("Pet registered successfully!");
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
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

  const filteredPets = pets.filter(p => {
    const owner = owners.find(o => o.id === p.ownerId);
    const searchString = `${p.name} ${p.breed} ${p.id} ${owner ? owner.name : ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter ? p.species === speciesFilter : true;
    return matchesSearch && matchesSpecies;
  });

  return (
    <>
      <section className="dashboard-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i> Register Pet
        </button>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div className="action-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search pets by name or breed..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Pet ID</th>
                <th>Photo</th>
                <th>Pet Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Weight</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : filteredPets.length === 0 ? (
                <tr><td colSpan="10" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No pets found.</td></tr>
              ) : (
                filteredPets.map(p => {
                  const owner = owners.find(o => o.id === p.ownerId);
                  return (
                    <tr key={p.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{p.id}</strong></td>
                      <td>
                        <img src={p.photo} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      </td>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.species}</td>
                      <td>{p.breed}</td>
                      <td>{p.age}</td>
                      <td>{p.gender}</td>
                      <td>{p.weight} kg</td>
                      <td>{owner ? owner.name : <span style={{color: 'red'}}>Unknown Owner</span>}</td>
                      <td className="table-actions">
                        <button className="btn-icon edit" title="Edit" onClick={() => handleOpenModal(p)}><i className="fas fa-pencil-alt"></i></button>
                        <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(p.id)}><i className="fas fa-trash-alt"></i></button>
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
              <h3>{formData.id ? "Edit Pet Details" : "Register New Pet"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Pet Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Owner *</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.ownerId}
                      onChange={e => setFormData({...formData, ownerId: e.target.value})}
                    >
                      <option value="" disabled>Select an owner</option>
                      {owners.map(o => (
                        <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Species *</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.species}
                      onChange={e => setFormData({...formData, species: e.target.value})}
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Breed *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.breed}
                      onChange={e => setFormData({...formData, breed: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div className="form-group">
                    <label>Age (Years) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      min="0" step="0.5" 
                      required 
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Weight (kg) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      min="0.1" step="0.1" 
                      required 
                      value={formData.weight}
                      onChange={e => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Photo Image URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    value={formData.photo}
                    onChange={e => setFormData({...formData, photo: e.target.value})}
                  />
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={formData.photo} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300' }} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPets;
