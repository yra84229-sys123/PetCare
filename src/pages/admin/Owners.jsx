import { useEffect, useState } from 'react';

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const loadData = async () => {
    if (window.PetCareDB) {
      try {
        const [allOwners, allPets] = await Promise.all([
          window.PetCareDB.owners.getAll(),
          window.PetCareDB.pets.getAll()
        ]);
        setOwners(allOwners);
        setPets(allPets);
      } catch (err) {
        console.error("Failed to load owners/pets", err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "Manage Owner Records";
    if (desc) desc.textContent = "Register and update customer contact details and view their registered pets.";
    
    loadData();
  }, []);

  const handleOpenModal = (owner = null) => {
    if (owner) {
      setFormData({
        id: owner.id,
        name: owner.name,
        phone: owner.phone,
        email: owner.email,
        address: owner.address
      });
    } else {
      setFormData({
        id: '',
        name: '',
        phone: '',
        email: '',
        address: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSave = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim()
    };

    try {
      if (formData.id) {
        const ownerObj = await window.PetCareDB.owners.getById(formData.id);
        await window.PetCareDB.owners.update(formData.id, Object.assign(ownerObj, dataToSave));
        alert("Owner updated successfully!");
      } else {
        await window.PetCareDB.owners.create(dataToSave);
        alert("Owner registered successfully!");
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this owner? Active bookings and pets will prevent deletion.")) {
      try {
        await window.PetCareDB.owners.delete(id);
        alert("Owner deleted.");
        loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredOwners = owners.filter(o => {
    const searchString = `${o.name} ${o.email} ${o.phone} ${o.id}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <section className="dashboard-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i> Add Owner
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
                placeholder="Search owners by name, phone, or email..." 
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
                <th>Owner ID</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Home Address</th>
                <th>Pets Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : filteredOwners.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No owners found.</td></tr>
              ) : (
                filteredOwners.map(o => {
                  const ownerPets = pets.filter(p => p.ownerId === o.id);
                  return (
                    <tr key={o.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{o.id}</strong></td>
                      <td><strong>{o.name}</strong></td>
                      <td>{o.phone}</td>
                      <td>{o.email}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={o.address}>{o.address}</td>
                      <td><span className="badge" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-color)', fontWeight: 'bold' }}>{ownerPets.length} Pets</span></td>
                      <td className="table-actions">
                        <button className="btn-icon edit" title="Edit" onClick={() => handleOpenModal(o)}><i className="fas fa-pencil-alt"></i></button>
                        <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(o.id)}><i className="fas fa-trash-alt"></i></button>
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
              <h3>{formData.id ? "Edit Owner Details" : "Add New Owner"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      required 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Home Address *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Owner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOwners;
