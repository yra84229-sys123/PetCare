/**
 * PetCareBooking - Pets Management Module (pets.js)
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Check auth session
  const currentUser = await PetCareDB.auth.checkSession(["admin", "user"]);
  if (!currentUser) return;

  // Global references
  const petsTableBody = document.getElementById("petsTableBody");
  const petSearchInput = document.getElementById("petSearchInput");
  const petSpeciesFilter = document.getElementById("petSpeciesFilter");
  
  // Modal & Form elements
  const petModal = document.getElementById("petModal");
  const petForm = document.getElementById("petForm");
  const petModalTitle = document.getElementById("petModalTitle");
  const btnAddPet = document.getElementById("btnAddPet");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const btnCancelPet = document.getElementById("btnCancelPet");
  
  // Form fields
  const petIdInput = document.getElementById("petId");
  const petNameInput = document.getElementById("petName");
  const petSpeciesInput = document.getElementById("petSpecies");
  const petBreedInput = document.getElementById("petBreed");
  const petAgeInput = document.getElementById("petAge");
  const petGenderInput = document.getElementById("petGender");
  const petWeightInput = document.getElementById("petWeight");
  const petOwnerInput = document.getElementById("petOwner");
  const petPhotoInput = document.getElementById("petPhoto");
  const photoPreview = document.getElementById("photoPreview");

  // Load and Render Pets
  async function renderPets() {
    if (!petsTableBody) return;

    try {
      const pets = await PetCareDB.pets.getAll();
      const owners = await PetCareDB.owners.getAll();
      const searchTerm = petSearchInput ? petSearchInput.value.toLowerCase() : "";
    const speciesFilter = petSpeciesFilter ? petSpeciesFilter.value : "";

    petsTableBody.innerHTML = "";

    const filteredPets = pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm) || 
                            pet.breed.toLowerCase().includes(searchTerm);
      const matchesSpecies = speciesFilter === "" || pet.species === speciesFilter;
      return matchesSearch && matchesSpecies;
    });

    if (filteredPets.length === 0) {
      petsTableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 40px 0;">No pets found.</td></tr>`;
      return;
    }

    filteredPets.forEach(pet => {
      const owner = owners.find(o => o.id === pet.ownerId);
      const ownerName = owner ? owner.name : "Unknown Owner";
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color: var(--primary);">${pet.id}</strong></td>
        <td>
          <img src="${pet.photo}" alt="${pet.name}" class="table-avatar" onerror="this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'">
        </td>
        <td><strong>${pet.name}</strong></td>
        <td><span class="badge" style="background-color: var(--bg-light); color: var(--text-dark);">${pet.species}</span></td>
        <td>${pet.breed}</td>
        <td>${pet.age} yrs</td>
        <td>${pet.gender}</td>
        <td>${pet.weight} kg</td>
        <td>${ownerName}</td>
        <td class="table-actions">
          <button class="btn-icon view btn-view-pet" data-id="${pet.id}" title="View details"><i class="fas fa-eye"></i></button>
          ${currentUser.role === 'admin' ? `
            <button class="btn-icon edit btn-edit-pet" data-id="${pet.id}" title="Edit"><i class="fas fa-pencil-alt"></i></button>
            <button class="btn-icon delete btn-delete-pet" data-id="${pet.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
          ` : ''}
        </td>
      `;
      petsTableBody.appendChild(tr);
    });

    // Attach listeners to dynamic buttons
    document.querySelectorAll(".btn-view-pet").forEach(btn => {
      btn.addEventListener("click", async () => await viewPetDetails(btn.dataset.id));
    });
    document.querySelectorAll(".btn-edit-pet").forEach(btn => {
      btn.addEventListener("click", async () => await openEditModal(btn.dataset.id));
    });
    document.querySelectorAll(".btn-delete-pet").forEach(btn => {
      btn.addEventListener("click", async () => await deletePet(btn.dataset.id));
    });
    } catch(err) {
      console.error(err);
    }
  }

  // Populate Owner Options in Select Dropdown
  async function populateOwnerDropdown() {
    if (!petOwnerInput) return;
    const owners = await PetCareDB.owners.getAll();
    petOwnerInput.innerHTML = `<option value="" disabled selected>Select Pet Owner</option>`;
    owners.forEach(owner => {
      const option = document.createElement("option");
      option.value = owner.id;
      option.textContent = `${owner.name} (${owner.phone})`;
      petOwnerInput.appendChild(option);
    });
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
  if (btnAddPet) {
    btnAddPet.addEventListener("click", async () => {
      petForm.reset();
      petIdInput.value = "";
      petModalTitle.textContent = "Register New Pet";
      photoPreview.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300"; // default placeholder
      await populateOwnerDropdown();
      petModal.classList.add("active");
    });
  }

  // Close Modal
  function closeModal() {
    if (petModal) petModal.classList.remove("active");
  }
  if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
  if (btnCancelPet) btnCancelPet.addEventListener("click", closeModal);

  // Photo URL Live Preview
  if (petPhotoInput) {
    petPhotoInput.addEventListener("input", () => {
      const url = petPhotoInput.value.trim();
      photoPreview.src = url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300";
    });
  }

  // Form Submit (Create & Update)
  if (petForm) {
    petForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = petIdInput.value;
      const petData = {
        name: petNameInput.value.trim(),
        species: petSpeciesInput.value,
        breed: petBreedInput.value.trim(),
        age: petAgeInput.value.trim(),
        gender: petGenderInput.value,
        weight: petWeightInput.value.trim(),
        ownerId: petOwnerInput.value,
        photo: petPhotoInput.value.trim() || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300"
      };

      try {
        if (id) {
          // Update
          await PetCareDB.pets.update(id, petData);
          toast("Pet updated successfully!");
        } else {
          // Create
          await PetCareDB.pets.create(petData);
          toast("New pet registered successfully!");
        }
        closeModal();
        await renderPets();
      } catch (err) {
        toast(err.message, "error");
      }
    });
  }

  // Open Modal for Edit
  async function openEditModal(id) {
    const pet = await PetCareDB.pets.getById(id);
    if (!pet) return;

    petIdInput.value = pet.id;
    petNameInput.value = pet.name;
    petSpeciesInput.value = pet.species;
    petBreedInput.value = pet.breed;
    petAgeInput.value = pet.age;
    petGenderInput.value = pet.gender;
    petWeightInput.value = pet.weight;
    
    await populateOwnerDropdown();
    petOwnerInput.value = pet.ownerId;
    
    petPhotoInput.value = pet.photo.includes("unsplash.com") ? pet.photo : "";
    photoPreview.src = pet.photo;
    
    petModalTitle.textContent = "Edit Pet Details";
    petModal.classList.add("active");
  }

  // View Pet Details Read-only Modal
  async function viewPetDetails(id) {
    const pet = await PetCareDB.pets.getById(id);
    const owner = await PetCareDB.owners.getById(pet.ownerId);
    if (!pet) return;

    const detailsHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${pet.photo}" alt="${pet.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid var(--accent); margin-bottom: 12px;">
        <h3 style="color: var(--primary); font-size: 24px; font-weight: 800;">${pet.name}</h3>
        <p style="color: var(--text-muted); font-size: 14px;">Pet ID: ${pet.id}</p>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 15px;">
        <div><strong>Species:</strong> ${pet.species}</div>
        <div><strong>Breed:</strong> ${pet.breed}</div>
        <div><strong>Age:</strong> ${pet.age} Years</div>
        <div><strong>Gender:</strong> ${pet.gender}</div>
        <div><strong>Weight:</strong> ${pet.weight} kg</div>
        <div><strong>Owner Name:</strong> ${owner ? owner.name : 'N/A'}</div>
      </div>
      <div style="background-color: var(--bg-light); padding: 16px; border-radius: var(--radius-sm); font-size: 14px;">
        <h4 style="color: var(--primary); font-weight: 700; margin-bottom: 6px;"><i class="fas fa-user"></i> Owner Contact Info</h4>
        <p><strong>Phone:</strong> ${owner ? owner.phone : 'N/A'}</p>
        <p><strong>Email:</strong> ${owner ? owner.email : 'N/A'}</p>
        <p><strong>Address:</strong> ${owner ? owner.address : 'N/A'}</p>
      </div>
    `;

    // Create a temporary overlay/modal for viewing
    const viewModal = document.createElement("div");
    viewModal.className = "modal active";
    viewModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Pet Medical Profile</h3>
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

  // Delete Pet
  async function deletePet(id) {
    if (confirm("Are you sure you want to delete this pet record? This action cannot be undone.")) {
      try {
        await PetCareDB.pets.delete(id);
        toast("Pet deleted successfully!");
        await renderPets();
      } catch (err) {
        toast(err.message, "error");
      }
    }
  }

  // Event Listeners for Search and Filters
  if (petSearchInput) petSearchInput.addEventListener("input", renderPets);
  if (petSpeciesFilter) petSpeciesFilter.addEventListener("change", renderPets);

  // Initialize page
  renderPets();
});
