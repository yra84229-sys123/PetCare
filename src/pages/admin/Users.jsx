import { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'Active'
  });

  const loadData = async () => {
    if (window.PetCareDB) {
      try {
        const allUsers = await window.PetCareDB.users.getAll();
        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "Manage Users";
    if (desc) desc.textContent = "Register system logins for users, reset credentials, and edit access status.";
    
    loadData();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '', // Do not load the password hash
        status: user.status || 'Active'
      });
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSave = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      status: formData.status
    };

    if (formData.password) {
      dataToSave.password = formData.password; // Note: In a real app this should be hashed, but we mimic legacy.
    }

    try {
      if (formData.id) {
        const uObj = await window.PetCareDB.users.getById(formData.id);
        await window.PetCareDB.users.update(formData.id, Object.assign(uObj, dataToSave));
        alert("User updated successfully!");
      } else {
        if (!formData.password) {
          alert("Password is required for new users.");
          return;
        }
        await window.PetCareDB.users.create(dataToSave);
        alert("User registered successfully!");
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await window.PetCareDB.users.delete(id);
        alert("User deleted.");
        loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const searchString = `${u.name} ${u.email}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <section className="dashboard-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i> Register User
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
                placeholder="Search users by name or email..." 
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
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td></tr>
              ) : (
                filteredUsers.map(u => {
                  let badgeClass = u.status === 'Active' ? 'badge-confirmed' : 'badge-cancelled';
                  return (
                    <tr key={u.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{u.id}</strong></td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone || '-'}</td>
                      <td><span className={`badge ${badgeClass}`}>{u.status || 'Active'}</span></td>
                      <td className="table-actions">
                        <button className="btn-icon edit" title="Edit User" onClick={() => handleOpenModal(u)}><i className="fas fa-pencil-alt"></i></button>
                        <button className="btn-icon delete" title="Delete User" onClick={() => handleDelete(u.id)}><i className="fas fa-trash-alt"></i></button>
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
              <h3>{formData.id ? "Edit User Details" : "Register User"}</h3>
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
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-grid-2">
                  <div className="form-group">
                    <label>Portal Password {formData.id ? '' : '*'}</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder={formData.id ? "Leave blank to keep unchanged" : "Enter password"}
                      required={!formData.id}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Login Access status *</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive / Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
