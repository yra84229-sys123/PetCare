/**
 * PetCareBooking - Admin Dashboard Controller (admin.js)
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Check Admin auth session
  const currentUser = await PetCareDB.auth.checkSession(["admin"]);
  if (!currentUser) return;

  // Set Profile Name and initials
  const profileName = document.getElementById("adminProfileName");
  const profileInitials = document.getElementById("adminProfileInitials");
  if (profileName) profileName.textContent = currentUser.name;
  if (profileInitials) {
    const initials = currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase();
    profileInitials.textContent = initials;
  }

  // Dashboard Stats Elements
  const statPets = document.getElementById("statTotalPets");
  const statOwners = document.getElementById("statTotalOwners");
  const statBookings = document.getElementById("statTotalBookings");
  const statUsers = document.getElementById("statTotalUsers");

  // Recent Bookings List
  const recentBookingsList = document.getElementById("recentBookingsList");

  // Booking Report Elements
  const reportPendingCount = document.getElementById("reportPendingCount");
  const reportConfirmedCount = document.getElementById("reportConfirmedCount");
  const reportCompletedCount = document.getElementById("reportCompletedCount");
  const reportCancelledCount = document.getElementById("reportCancelledCount");

  const progressPending = document.getElementById("progressPending");
  const progressConfirmed = document.getElementById("progressConfirmed");
  const progressCompleted = document.getElementById("progressCompleted");
  const progressCancelled = document.getElementById("progressCancelled");

  async function loadDashboardData() {
    try {
      const stats = await PetCareDB.getStats();

      // Populate Stat Counters
    if (statPets) statPets.textContent = stats.totalPets;
    if (statOwners) statOwners.textContent = stats.totalOwners;
    if (statBookings) statBookings.textContent = stats.totalBookings;
    if (statUsers) statUsers.textContent = stats.totalUsers;

    // Populate Booking Report (Counts & Progress Bars)
    const counts = stats.statusCounts;
    const total = stats.totalBookings || 1; // avoid division by zero

    if (reportPendingCount) reportPendingCount.textContent = counts.Pending;
    if (reportConfirmedCount) reportConfirmedCount.textContent = counts.Confirmed;
    if (reportCompletedCount) reportCompletedCount.textContent = counts.Completed;
    if (reportCancelledCount) reportCancelledCount.textContent = counts.Cancelled;

    if (progressPending) progressPending.style.width = `${(counts.Pending / total) * 100}%`;
    if (progressConfirmed) progressConfirmed.style.width = `${(counts.Confirmed / total) * 100}%`;
    if (progressCompleted) progressCompleted.style.width = `${(counts.Completed / total) * 100}%`;
    if (progressCancelled) progressCancelled.style.width = `${(counts.Cancelled / total) * 100}%`;

    // Populate Recent Bookings Table
    if (recentBookingsList) {
      recentBookingsList.innerHTML = "";
      if (stats.recentBookings.length === 0) {
        recentBookingsList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No bookings available.</td></tr>`;
        return;
      }

      stats.recentBookings.forEach(b => {
        let badgeClass = "badge-pending";
        if (b.status === "Confirmed") badgeClass = "badge-confirmed";
        if (b.status === "Completed") badgeClass = "badge-completed";
        if (b.status === "Cancelled") badgeClass = "badge-cancelled";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong style="color: var(--primary);">${b.id}</strong></td>
          <td><strong>${b.petName}</strong></td>
          <td>${b.ownerName}</td>
          <td><span class="badge" style="background-color: var(--bg-light); color: var(--primary); font-weight:600;">${b.service}</span></td>
          <td>${b.date} ${b.time}</td>
          <td><span class="badge ${badgeClass}">${b.status}</span></td>
        `;
        recentBookingsList.appendChild(tr);
      });
    }
    } catch (e) {
      console.error("Failed to load stats", e);
    }
  }

  // Sidebar logout click listener
  const btnLogout = document.getElementById("adminLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out from the dashboard?")) {
        PetCareDB.auth.logout();
      }
    });
  }

  // Mobile Dashboard Sidebar Toggle
  const sidebar = document.querySelector(".sidebar");
  const hamburger = document.getElementById("dashboardHamburger");
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Initialize Dashboard
  loadDashboardData();
});
