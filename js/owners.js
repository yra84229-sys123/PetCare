/**
 * PetCareBooking - Owners Management Module (owners.js)
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Check auth session
  const currentUser = await PetCareDB.auth.checkSession(["admin", "user"]);
  if (!currentUser) return;

  // Global references
  const ownersTableBody = document.getElementById("ownersTableBody");
  const ownerSearchInput = document.getElementById("ownerSearchInput");
  
  // Modal & Form elements
  const ownerModal = document.getElementById("ownerModal");
  const ownerForm = document.getElementById("ownerForm");
  const ownerModalTitle = document.getElementById("ownerModalTitle");
  const btnAddOwner = document.getElementById("btnAddOwner");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const btnCancelOwner = document.getElementById("btnCancelOwner");
  
  // Form fields
  const ownerIdInput = document.getElementById("ownerId");
  const ownerNameInput = document.getElementById("ownerName");
  const ownerPhoneInput = document.getElementById("ownerPhone");
  const ownerEmailInput = document.getElementById("ownerEmail");
  const ownerAddressInput = document.getElementById("ownerAddress");

  // Load and Render Owners
  async function renderOwners() {
    if (!ownersTableBody) return;

    try {
      const owners = await PetCareDB.owners.getAll();
      const pets = await PetCareDB.pets.getAll();
      const searchTerm = ownerSearchInput ? ownerSearchInput.value.toLowerCase() : "";

    ownersTableBody.innerHTML = "";

    const filteredOwners = owners.filter(owner => {
      return owner.name.toLowerCase().includes(searchTerm) || 
             owner.phone.includes(searchTerm) || 
             owner.email.toLowerCase().includes(searchTerm);
    });

    if (filteredOwners.length === 0) {
      ownersTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px 0;">No owners found.</td></tr>`;
      return;
    }

    filteredOwners.forEach(owner => {
      // Calculate how many pets this owner has
      const ownerPetsCount = pets.filter(p => p.ownerId === owner.id).length;
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color: var(--primary);">${owner.id}</strong></td>
        <td><strong>${owner.name}</strong></td>
        <td>${owner.phone}</td>
        <td>${owner.email}</td>
        <td>${owner.address}</td>
        <td><span class="badge" style="background-color: rgba(99, 102, 241, 0.1); color: #6366f1;">${ownerPetsCount} Pet(s)</span></td>
        <td class="table-actions">
          <button class="btn-icon view btn-view-owner" data-id="${owner.id}" title="View details"><i class="fas fa-eye"></i></button>
          ${currentUser.role === 'admin' ? `
            <button class="btn-icon edit btn-edit-owner" data-id="${owner.id}" title="Edit"><i class="fas fa-pencil-alt"></i></button>
            <button class="btn-icon delete btn-delete-owner" data-id="${owner.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
          ` : ''}
        </td>
      `;
      ownersTableBody.appendChild(tr);
    });

    // Attach listeners to dynamic buttons
    document.querySelectorAll(".btn-view-owner").forEach(btn => {
      btn.addEventListener("click", async () => await viewOwnerDetails(btn.dataset.id));
    });
    document.querySelectorAll(".btn-edit-owner").forEach(btn => {
      btn.addEventListener("click", async () => await openEditModal(btn.dataset.id));
    });
    document.querySelectorAll(".btn-delete-owner").forEach(btn => {
      btn.addEventListener("click", async () => await deleteOwner(btn.dataset.id));
    });
    } catch(err) {
      console.error(err);
    }
  }

  // Show Toast Message
  function toast(msg, type = "success") {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      alert(msg);
    }
  }

  // Open Modal for Create
  if (btnAddOwner) {
    btnAddOwner.addEventListener("click", () => {
      ownerForm.reset();
      ownerIdInput.value = "";
      ownerModalTitle.textContent = "Add New Owner";
      ownerModal.classList.add("active");
    });
  }

  // Close Modal
  function closeModal() {
    if (ownerModal) ownerModal.classList.remove("active");
  }
  if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
  if (btnCancelOwner) btnCancelOwner.addEventListener("click", closeModal);

  // Form Submit (Create & Update)
  if (ownerForm) {
    ownerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = ownerIdInput.value;
      const ownerData = {
        name: ownerNameInput.value.trim(),
        phone: ownerPhoneInput.value.trim(),
        email: ownerEmailInput.value.trim(),
        address: ownerAddressInput.value.trim()
      };

      try {
        if (id) {
          // Update
          await PetCareDB.owners.update(id, ownerData);
          toast("Owner details updated!");
        } else {
          // Create
          await PetCareDB.owners.create(ownerData);
          toast("New owner registered!");
        }
        closeModal();
        await renderOwners();
      } catch (err) {
        toast(err.message, "error");
      }
    });
  }

  // Open Modal for Edit
  async function openEditModal(id) {
    const owner = await PetCareDB.owners.getById(id);
    if (!owner) return;

    ownerIdInput.value = owner.id;
    ownerNameInput.value = owner.name;
    ownerPhoneInput.value = owner.phone;
    ownerEmailInput.value = owner.email;
    ownerAddressInput.value = owner.address;
    
    ownerModalTitle.textContent = "Edit Owner Details";
    ownerModal.classList.add("active");
  }

  // View Owner Details Read-only Modal
  async function viewOwnerDetails(id) {
    const owner = await PetCareDB.owners.getById(id);
    const pets = (await PetCareDB.pets.getAll()).filter(p => p.ownerId === id);
    if (!owner) return;

    let petsListHtml = "";
    if (pets.length === 0) {
      petsListHtml = `<p style="color: var(--text-muted);">No pets registered under this owner.</p>`;
    } else {
      pets.forEach(pet => {
        petsListHtml += `
          <div style="display: flex; align-items: center; gap: 12px; background: #ffffff; padding: 10px; border-radius: var(--radius-sm); border: 1.5px solid var(--border-color); margin-bottom: 8px;">
            <img src="${pet.photo}" alt="${pet.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            <div>
              <strong style="color: var(--primary);">${pet.name}</strong><br>
              <span style="font-size: 12px; color: var(--text-muted);">${pet.species} • ${pet.breed}</span>
            </div>
          </div>
        `;
      });
    }

    const detailsHtml = `
      <div style="margin-bottom: 24px; font-size: 15px;">
        <h3 style="color: var(--primary); font-size: 22px; font-weight: 800; margin-bottom: 4px;">${owner.name}</h3>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">Owner ID: ${owner.id}</p>
        <p><strong><i class="fas fa-phone-alt" style="color: var(--primary);"></i> Phone:</strong> ${owner.phone}</p>
        <p><strong><i class="fas fa-envelope" style="color: var(--primary);"></i> Email:</strong> ${owner.email}</p>
        <p><strong><i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> Address:</strong> ${owner.address}</p>
      </div>
      <div style="background-color: var(--bg-light); padding: 16px; border-radius: var(--radius-sm);">
        <h4 style="color: var(--primary); font-weight: 700; margin-bottom: 12px;"><i class="fas fa-paw"></i> Registered Pets (${pets.length})</h4>
        ${petsListHtml}
      </div>
    `;

    const viewModal = document.createElement("div");
    viewModal.className = "modal active";
    viewModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Owner & Pet Profile</h3>
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

  // Delete Owner
  async function deleteOwner(id) {
    if (confirm("Are you sure you want to delete this owner? This will fail if they have registered pets.")) {
      try {
        await PetCareDB.owners.delete(id);
        toast("Owner deleted successfully!");
        await renderOwners();
      } catch (err) {
        toast(err.message, "error");
      }
    }
  }

  // Search input change listener
  if (ownerSearchInput) ownerSearchInput.addEventListener("input", renderOwners);

  // Initialize
  renderOwners();
});
