/**
 * PetCareBooking - Bookings Management Module (bookings.js)
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Check auth session
  const currentUser = await PetCareDB.auth.checkSession(["admin", "user"]);
  if (!currentUser) return;

  // Global references
  const bookingsTableBody = document.getElementById("bookingsTableBody");
  const bookingSearchInput = document.getElementById("bookingSearchInput");
  const bookingStatusFilter = document.getElementById("bookingStatusFilter");
  const bookingDateFilter = document.getElementById("bookingDateFilter");

  // Modal & Form elements
  const bookingModal = document.getElementById("bookingModal");
  const bookingForm = document.getElementById("bookingForm");
  const bookingModalTitle = document.getElementById("bookingModalTitle");
  const btnAddBooking = document.getElementById("btnAddBooking");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const btnCancelBooking = document.getElementById("btnCancelBooking");

  // Form Fields
  const bookingIdInput = document.getElementById("bookingId");
  const bookingOwnerInput = document.getElementById("bookingOwner");
  const bookingPetInput = document.getElementById("bookingPet");
  const bookingServiceInput = document.getElementById("bookingService");
  const bookingDateInput = document.getElementById("bookingDate");
  const bookingTimeInput = document.getElementById("bookingTime");
  const bookingStatusInput = document.getElementById("bookingStatus");
  const bookingNotesInput = document.getElementById("bookingNotes");

  // Show Toast
  function toast(msg, type = "success") {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      alert(msg);
    }
  }

  // Load and Render Bookings Table
  async function renderBookings() {
    if (!bookingsTableBody) return;

    try {
      const bookings = await PetCareDB.bookings.getAll();
      const pets = await PetCareDB.pets.getAll();
      const owners = await PetCareDB.owners.getAll();

    const searchTerm = bookingSearchInput ? bookingSearchInput.value.toLowerCase() : "";
    const statusFilter = bookingStatusFilter ? bookingStatusFilter.value : "";
    const dateFilter = bookingDateFilter ? bookingDateFilter.value : "";

    bookingsTableBody.innerHTML = "";

    const filteredBookings = bookings.filter(b => {
      const pet = pets.find(p => p.id === b.petId);
      const owner = owners.find(o => o.id === b.ownerId);
      
      const petName = pet ? pet.name.toLowerCase() : "";
      const ownerName = owner ? owner.name.toLowerCase() : "";
      const serviceName = b.service.toLowerCase();

      const matchesSearch = petName.includes(searchTerm) || 
                            ownerName.includes(searchTerm) || 
                            serviceName.includes(searchTerm) ||
                            b.id.toLowerCase().includes(searchTerm);
                            
      const matchesStatus = statusFilter === "" || b.status === statusFilter;
      const matchesDate = dateFilter === "" || b.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });

    if (filteredBookings.length === 0) {
      bookingsTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 40px 0;">No bookings found.</td></tr>`;
      return;
    }

    // Sort by date desc, time desc
    filteredBookings.sort((a,b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

    filteredBookings.forEach(b => {
      const pet = pets.find(p => p.id === b.petId);
      const owner = owners.find(o => o.id === b.ownerId);

      const petName = pet ? pet.name : "Unknown Pet";
      const ownerName = owner ? owner.name : "Unknown Owner";
      const petPhoto = pet ? pet.photo : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100";

      // Status badge styles
      let badgeClass = "badge-pending";
      if (b.status === "Confirmed") badgeClass = "badge-confirmed";
      if (b.status === "Completed") badgeClass = "badge-completed";
      if (b.status === "Cancelled") badgeClass = "badge-cancelled";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color: var(--primary);">${b.id}</strong></td>
        <td>
          <div class="table-avatar-cell">
            <img src="${petPhoto}" alt="${petName}" class="table-avatar" onerror="this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'">
            <div>
              <strong>${petName}</strong><br>
              <span class="table-avatar-sub">${pet ? pet.species : ""}</span>
            </div>
          </div>
        </td>
        <td>
          <div>
            <strong>${ownerName}</strong><br>
            <span class="table-avatar-sub">${owner ? owner.phone : ""}</span>
          </div>
        </td>
        <td><span class="badge" style="background-color: var(--bg-light); color: var(--primary); font-weight:600;">${b.service}</span></td>
        <td>
          <div>
            <strong>${b.date}</strong><br>
            <span class="table-avatar-sub"><i class="far fa-clock"></i> ${b.time}</span>
          </div>
        </td>
        <td><span class="badge ${badgeClass}">${b.status}</span></td>
        <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.notes || ''}">
          ${b.notes || '<span style="color:var(--text-muted); font-style:italic;">None</span>'}
        </td>
        <td class="table-actions">
          <button class="btn-icon view btn-view-booking" data-id="${b.id}" title="View details"><i class="fas fa-eye"></i></button>
          <button class="btn-icon edit btn-edit-booking" data-id="${b.id}" title="Edit"><i class="fas fa-pencil-alt"></i></button>
          ${currentUser.role === 'admin' ? `
            <button class="btn-icon delete btn-delete-booking" data-id="${b.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
          ` : ''}
        </td>
      `;
      bookingsTableBody.appendChild(tr);
    });

    // Event listeners for action buttons
    document.querySelectorAll(".btn-view-booking").forEach(btn => {
      btn.addEventListener("click", async () => await viewBookingDetails(btn.dataset.id));
    });
    document.querySelectorAll(".btn-edit-booking").forEach(btn => {
      btn.addEventListener("click", async () => await openEditModal(btn.dataset.id));
    });
    document.querySelectorAll(".btn-delete-booking").forEach(btn => {
      btn.addEventListener("click", async () => await deleteBooking(btn.dataset.id));
    });
    } catch(err) {
      console.error(err);
    }
  }

  // Populate Dropdowns: Owners and Pets
  async function populateFormDropdowns() {
    if (!bookingOwnerInput || !bookingPetInput) return;

    const owners = await PetCareDB.owners.getAll();
    const pets = await PetCareDB.pets.getAll();

    // Populate Owners
    bookingOwnerInput.innerHTML = `<option value="" disabled selected>Select Owner</option>`;
    owners.forEach(owner => {
      const option = document.createElement("option");
      option.value = owner.id;
      option.textContent = `${owner.name} (${owner.phone})`;
      bookingOwnerInput.appendChild(option);
    });

    // Populate Pets (Initially all, or filtered based on selection)
    updatePetDropdown();
  }

  // Update Pet Options dynamically based on Owner selection
  async function updatePetDropdown(selectedOwnerId = "", selectPetId = "") {
    if (!bookingPetInput) return;

    const pets = await PetCareDB.pets.getAll();
    const filteredPets = selectedOwnerId ? pets.filter(p => p.ownerId === selectedOwnerId) : pets;

    bookingPetInput.innerHTML = `<option value="" disabled selected>Select Pet</option>`;
    
    if (filteredPets.length === 0 && selectedOwnerId) {
      const option = document.createElement("option");
      option.value = "";
      option.disabled = true;
      option.textContent = "No registered pets found for this owner";
      bookingPetInput.appendChild(option);
      return;
    }

    filteredPets.forEach(pet => {
      const option = document.createElement("option");
      option.value = pet.id;
      option.textContent = `${pet.name} (${pet.species} - ${pet.breed})`;
      if (pet.id === selectPetId) option.selected = true;
      bookingPetInput.appendChild(option);
    });
  }

  // Reactivity in Form Dropdowns
  if (bookingOwnerInput) {
    bookingOwnerInput.addEventListener("change", async () => {
      const ownerId = bookingOwnerInput.value;
      await updatePetDropdown(ownerId);
    });
  }

  if (bookingPetInput) {
    bookingPetInput.addEventListener("change", async () => {
      const petId = bookingPetInput.value;
      const pet = await PetCareDB.pets.getById(petId);
      if (pet && (!bookingOwnerInput.value || bookingOwnerInput.value !== pet.ownerId)) {
        // Automatically sync the Owner dropdown with the selected Pet's owner
        bookingOwnerInput.value = pet.ownerId;
        // Re-filter pet dropdown to match this owner but preserve selected pet
        await updatePetDropdown(pet.ownerId, petId);
      }
    });
  }

  // Open Modal for Create
  if (btnAddBooking) {
    btnAddBooking.addEventListener("click", async () => {
      bookingForm.reset();
      bookingIdInput.value = "";
      bookingModalTitle.textContent = "Create Appointment Booking";
      await populateFormDropdowns();
      
      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      bookingDateInput.value = tomorrow.toISOString().split('T')[0];
      bookingTimeInput.value = "09:00";
      
      // Reset Status to Pending
      bookingStatusInput.value = "Pending";
      
      bookingModal.classList.add("active");
    });
  }

  // Close Modal
  function closeModal() {
    if (bookingModal) bookingModal.classList.remove("active");
  }
  if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
  if (btnCancelBooking) btnCancelBooking.addEventListener("click", closeModal);

  // Form Submit (Create & Update)
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = bookingIdInput.value;
      const bookingData = {
        ownerId: bookingOwnerInput.value,
        petId: bookingPetInput.value,
        service: bookingServiceInput.value,
        date: bookingDateInput.value,
        time: bookingTimeInput.value,
        status: bookingStatusInput.value,
        notes: bookingNotesInput.value.trim()
      };

      if (!bookingData.ownerId || !bookingData.petId || !bookingData.service) {
        toast("Please select an owner, pet, and service.", "error");
        return;
      }

      try {
        if (id) {
          // Update
          await PetCareDB.bookings.update(id, bookingData);
          toast("Booking updated successfully!");
        } else {
          // Create
          await PetCareDB.bookings.create(bookingData);
          toast("New booking created successfully!");
        }
        closeModal();
        await renderBookings();
      } catch (err) {
        toast(err.message, "error");
      }
    });
  }

  // Open Modal for Edit
  async function openEditModal(id) {
    const bookings = await PetCareDB.bookings.getAll();
    const b = bookings.find(x => x.id === id);
    if (!b) return;

    bookingIdInput.value = b.id;
    await populateFormDropdowns();

    bookingOwnerInput.value = b.ownerId;
    await updatePetDropdown(b.ownerId, b.petId);

    bookingServiceInput.value = b.service;
    bookingDateInput.value = b.date;
    bookingTimeInput.value = b.time;
    bookingStatusInput.value = b.status;
    bookingNotesInput.value = b.notes || "";

    bookingModalTitle.textContent = "Edit Booking Appointment";
    bookingModal.classList.add("active");
  }

  // View Booking Details Details Read-only
  async function viewBookingDetails(id) {
    const bookings = await PetCareDB.bookings.getAll();
    const b = bookings.find(x => x.id === id);
    if (!b) return;

    const pet = await PetCareDB.pets.getById(b.petId);
    const owner = await PetCareDB.owners.getById(b.ownerId);

    let badgeClass = "badge-pending";
    if (b.status === "Confirmed") badgeClass = "badge-confirmed";
    if (b.status === "Completed") badgeClass = "badge-completed";
    if (b.status === "Cancelled") badgeClass = "badge-cancelled";

    const detailsHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <span class="badge ${badgeClass}" style="font-size: 14px; padding: 6px 16px; margin-bottom: 12px;">${b.status}</span>
        <h3 style="color: var(--primary); font-size: 22px; font-weight: 800;">Booking ID: ${b.id}</h3>
        <p style="color: var(--text-muted); font-size: 14px;">Scheduled Appointment Details</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div style="background-color: var(--bg-light); padding: 16px; border-radius: var(--radius-sm);">
          <h4 style="color: var(--primary); font-weight: 700; margin-bottom: 8px;"><i class="fas fa-paw"></i> Pet Patient</h4>
          <p><strong>Name:</strong> ${pet ? pet.name : 'Unknown'}</p>
          <p><strong>Species:</strong> ${pet ? pet.species : 'Unknown'}</p>
          <p><strong>Breed:</strong> ${pet ? pet.breed : 'Unknown'}</p>
        </div>
        <div style="background-color: var(--bg-light); padding: 16px; border-radius: var(--radius-sm);">
          <h4 style="color: var(--primary); font-weight: 700; margin-bottom: 8px;"><i class="fas fa-user"></i> Owner Client</h4>
          <p><strong>Name:</strong> ${owner ? owner.name : 'Unknown'}</p>
          <p><strong>Phone:</strong> ${owner ? owner.phone : 'Unknown'}</p>
          <p><strong>Email:</strong> ${owner ? owner.email : 'Unknown'}</p>
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 20px; font-size: 15px;">
        <p><strong><i class="fas fa-concierge-bell" style="color: var(--primary); width:20px;"></i> Service Requested:</strong> ${b.service}</p>
        <p><strong><i class="far fa-calendar-alt" style="color: var(--primary); width:20px;"></i> Appointment Date:</strong> ${b.date}</p>
        <p><strong><i class="far fa-clock" style="color: var(--primary); width:20px;"></i> Appointment Time:</strong> ${b.time}</p>
        <p style="margin-top: 12px;"><strong><i class="far fa-sticky-note" style="color: var(--primary); width:20px;"></i> Diagnostic Notes:</strong></p>
        <div style="background-color: #fff9e6; border-left: 3px solid #ffcc00; padding: 10px 15px; margin-top: 6px; border-radius: 4px; font-style: italic;">
          ${b.notes || 'No notes provided.'}
        </div>
      </div>
    `;

    const viewModal = document.createElement("div");
    viewModal.className = "modal active";
    viewModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Booking Assignment Information</h3>
          <button class="modal-close" id="btnCloseViewModal">&times;</button>
        </div>
        <div class="modal-body">${detailsHtml}</div>
        <div class="modal-footer">
          <button class="btn-primary" id="btnCloseViewModalBtn">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(viewModal);

    const closeView = () => viewModal.remove();
    viewModal.querySelector("#btnCloseViewModal").addEventListener("click", closeView);
    viewModal.querySelector("#btnCloseViewModalBtn").addEventListener("click", closeView);
  }

  // Delete Booking
  async function deleteBooking(id) {
    if (confirm("Are you sure you want to cancel and delete this booking permanently?")) {
      try {
        await PetCareDB.bookings.delete(id);
        toast("Booking deleted successfully!");
        await renderBookings();
      } catch (err) {
        toast(err.message, "error");
      }
    }
  }

  // Event Listeners for Filters and Search
  if (bookingSearchInput) bookingSearchInput.addEventListener("input", renderBookings);
  if (bookingStatusFilter) bookingStatusFilter.addEventListener("change", renderBookings);
  if (bookingDateFilter) bookingDateFilter.addEventListener("change", renderBookings);

  // Initialize
  renderBookings();
});
