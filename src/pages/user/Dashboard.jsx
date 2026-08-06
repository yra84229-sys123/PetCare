import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useOutletContext();
  const [owner, setOwner] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update Layout Title via DOM for simplicity in this migration
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "Welcome to Your Portal";
    if (desc) desc.textContent = "Manage your pets, book services, and keep track of appointments.";

    const loadData = async () => {
      if (window.PetCareDB && user) {
        try {
          const owners = await window.PetCareDB.owners.getAll();
          const currentOwner = owners.find(o => o.email.toLowerCase() === user.email.toLowerCase());
          setOwner(currentOwner);

          if (currentOwner) {
            const allBookings = await window.PetCareDB.bookings.getAll();
            const myBookings = allBookings.filter(b => b.ownerId === currentOwner.id);
            myBookings.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
            setRecentBookings(myBookings.slice(0, 5));
          }
        } catch (error) {
          console.error("Error loading dashboard data", error);
        }
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  return (
    <>
      <section className="dashboard-actions">
        <Link to="/user/bookings" className="btn-primary">
          <i className="fas fa-calendar-plus"></i> Book a New Appointment
        </Link>
      </section>

      <div className="dashboard-main-grid user-dashboard-grid">
        {/* View Recent Bookings */}
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Booking History</h2>
            <Link to="/user/bookings" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
          </div>
          
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading bookings...</td></tr>
                ) : !owner ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Please update your profile to see bookings.</td></tr>
                ) : recentBookings.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet.</td></tr>
                ) : (
                  recentBookings.map((b) => {
                    let badgeClass = "badge-pending";
                    if (b.status === "Confirmed") badgeClass = "badge-confirmed";
                    if (b.status === "Completed") badgeClass = "badge-completed";
                    if (b.status === "Cancelled") badgeClass = "badge-cancelled";
                    
                    return (
                      <tr key={b.id}>
                        <td><strong>{b.service}</strong></td>
                        <td>{b.date} <br /> <small>{b.time}</small></td>
                        <td><span className={`badge ${badgeClass}`}>{b.status}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* View My Profile Summary */}
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Profile Summary</h2>
            <Link to="/user/profile" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Update Profile</Link>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ marginBottom: '10px' }}><strong>Name:</strong> <span>{user.name}</span></p>
            <p style={{ marginBottom: '10px' }}><strong>Email:</strong> <span>{user.email}</span></p>
            <p style={{ marginBottom: '10px' }}><strong>Phone:</strong> <span>{owner?.phone || "Not provided"}</span></p>
          </div>
        </section>
      </div>
    </>
  );
};

export default UserDashboard;
