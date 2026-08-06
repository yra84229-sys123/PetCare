import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPets: 0,
    totalOwners: 0,
    totalBookings: 0,
    totalUsers: 0,
    statusCounts: { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 },
    recentBookings: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update Layout Title via DOM for simplicity in this migration
    const title = document.getElementById("page-title");
    const desc = document.getElementById("page-desc");
    if (title) title.textContent = "System Overview";
    if (desc) desc.textContent = "Welcome back to your administration command center.";

    const loadData = async () => {
      if (window.PetCareDB) {
        try {
          const data = await window.PetCareDB.getStats();
          setStats(data);
        } catch (error) {
          console.error("Error loading admin stats", error);
        }
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const total = stats.totalBookings || 1;

  return (
    <>
      {/* Stat Cards Row */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><i className="fas fa-dog"></i></div>
          <div className="stat-info">
            <h3>{stats.totalPets}</h3>
            <p>Total Pets</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><i className="fas fa-users"></i></div>
          <div className="stat-info">
            <h3>{stats.totalOwners}</h3>
            <p>Total Owners</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange"><i className="fas fa-calendar-check"></i></div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple"><i className="fas fa-user-md"></i></div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </section>

      {/* Grid for Reports & Recent Bookings */}
      <div className="dashboard-main-grid admin-dashboard-grid">

        {/* Booking Reports Section */}
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Booking Reports</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Progress Pending */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Pending Bookings</span>
                <span style={{ color: 'var(--color-pending)' }}>{stats.statusCounts.Pending}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-light)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.statusCounts.Pending / total) * 100}%`, height: '100%', backgroundColor: 'var(--color-pending)', transition: 'var(--transition)' }}></div>
              </div>
            </div>

            {/* Progress Confirmed */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Confirmed Bookings</span>
                <span style={{ color: 'var(--color-confirmed)' }}>{stats.statusCounts.Confirmed}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-light)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.statusCounts.Confirmed / total) * 100}%`, height: '100%', backgroundColor: 'var(--color-confirmed)', transition: 'var(--transition)' }}></div>
              </div>
            </div>

            {/* Progress Completed */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Completed Bookings</span>
                <span style={{ color: 'var(--color-completed)' }}>{stats.statusCounts.Completed}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-light)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.statusCounts.Completed / total) * 100}%`, height: '100%', backgroundColor: 'var(--color-completed)', transition: 'var(--transition)' }}></div>
              </div>
            </div>

            {/* Progress Cancelled */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Cancelled Bookings</span>
                <span style={{ color: 'var(--color-cancelled)' }}>{stats.statusCounts.Cancelled}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-light)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.statusCounts.Cancelled / total) * 100}%`, height: '100%', backgroundColor: 'var(--color-cancelled)', transition: 'var(--transition)' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Appointments Section */}
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Appointments</h2>
            <Link to="/admin/bookings" className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>Manage All</Link>
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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading bookings...</td></tr>
                ) : stats.recentBookings.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings available.</td></tr>
                ) : (
                  stats.recentBookings.map((b) => {
                    let badgeClass = "badge-pending";
                    if (b.status === "Confirmed") badgeClass = "badge-confirmed";
                    if (b.status === "Completed") badgeClass = "badge-completed";
                    if (b.status === "Cancelled") badgeClass = "badge-cancelled";

                    return (
                      <tr key={b.id}>
                        <td><strong style={{ color: 'var(--primary)' }}>{b.id}</strong></td>
                        <td><strong>{b.petName}</strong></td>
                        <td>{b.ownerName}</td>
                        <td><span className="badge" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)', fontWeight: 600 }}>{b.service}</span></td>
                        <td>{b.date} {b.time}</td>
                        <td><span className={`badge ${badgeClass}`}>{b.status}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </>
  );
};

export default AdminDashboard;
