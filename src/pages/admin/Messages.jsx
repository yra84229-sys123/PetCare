import { useEffect, useState } from 'react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadData = async () => {
    if (window.PetCareDB) {
      try {
        const allMessages = await window.PetCareDB.messages.getAll();
        allMessages.sort((a,b) => {
          const timeA = a.timestamp ? (typeof a.timestamp.toMillis === 'function' ? a.timestamp.toMillis() : new Date(a.timestamp).getTime()) : 0;
          const timeB = b.timestamp ? (typeof b.timestamp.toMillis === 'function' ? b.timestamp.toMillis() : new Date(b.timestamp).getTime()) : 0;
          return timeB - timeA;
        });
        setMessages(allMessages);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "View Messages";
    if (desc) desc.textContent = "Review inquiries and messages from users.";
    
    loadData();
  }, []);

  const handleOpenModal = (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await window.PetCareDB.messages.delete(id);
        alert("Message deleted.");
        loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredMessages = messages.filter(m => {
    const sender = m.senderId || m.localUserId || m.firebaseUid || 'Anonymous';
    const searchString = `${sender} ${m.text}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <section className="dashboard-panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <div className="action-bar">
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search messages..." 
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
                <th>Date & Time</th>
                <th>Sender ID</th>
                <th>Message Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : filteredMessages.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No messages found.</td></tr>
              ) : (
                filteredMessages.map(msg => {
                  const dateObj = msg.timestamp ? (typeof msg.timestamp.toDate === 'function' ? msg.timestamp.toDate() : new Date(msg.timestamp)) : new Date();
                  const dateStr = dateObj.toLocaleString();
                  const sender = msg.senderId || msg.localUserId || msg.firebaseUid || 'Anonymous';
                  const preview = msg.text.length > 50 ? msg.text.substring(0, 50) + "..." : msg.text;

                  return (
                    <tr key={msg.id}>
                      <td>{dateStr}</td>
                      <td><strong>{sender}</strong></td>
                      <td>{preview}</td>
                      <td className="table-actions">
                        <button className="btn-icon view" title="View Details" onClick={() => handleOpenModal(msg)}><i className="fas fa-eye"></i></button>
                        <button className="btn-icon delete" title="Delete Message" onClick={() => handleDelete(msg.id)}><i className="fas fa-trash-alt"></i></button>
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
      {isModalOpen && selectedMessage && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Message Details</h3>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>Date: </strong> {selectedMessage.timestamp ? (typeof selectedMessage.timestamp.toDate === 'function' ? selectedMessage.timestamp.toDate().toLocaleString() : new Date(selectedMessage.timestamp).toLocaleString()) : new Date().toLocaleString()}</p>
              <p><strong>Sender ID: </strong> {selectedMessage.senderId || selectedMessage.localUserId || selectedMessage.firebaseUid || 'Anonymous'}</p>
              <hr style={{ margin: '15px 0', borderTop: '1px solid var(--border-color)' }} />
              <p style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage.text}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={handleCloseModal} style={{ padding: '8px 24px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminMessages;
