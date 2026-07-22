/**
 * PetCareBooking - User Management Module (users.js)
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Check auth session
  const currentUser = await PetCareDB.auth.checkSession(["admin"]);
  if (!currentUser) return;

  // Global references
  const userTableBody = document.getElementById("staffTableBody");
  const userSearchInput = document.getElementById("staffSearchInput");

  // Modal & Form elements
  const userModal = document.getElementById("staffModal");
  const userForm = document.getElementById("staffForm");
  const userModalTitle = document.getElementById("staffModalTitle");
  const btnAddUser = document.getElementById("btnAddStaff");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const btnCancelUser = document.getElementById("btnCancelStaff");

  // Form Fields
  const userIdInput = document.getElementById("staffId");
  const userNameInput = document.getElementById("staffName");
  const userEmailInput = document.getElementById("staffEmail");
  const userPhoneInput = document.getElementById("staffPhone");
  const userPasswordInput = document.getElementById("staffPassword");
  const userStatusInput = document.getElementById("staffStatus");

  // Show Toast
  function toast(msg, type = "success") {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      alert(msg);
    }
  }

  // Load and Render Users
  async function renderUsers() {
    if (!userTableBody) return;

    try {
      const userList = await PetCareDB.usersManager.getAll();
      const searchTerm = userSearchInput ? userSearchInput.value.toLowerCase() : "";

    userTableBody.innerHTML = "";

    const filteredUsers = userList.filter(u => {
      return u.name.toLowerCase().includes(searchTerm) || 
             u.email.toLowerCase().includes(searchTerm) || 
             (u.phone && u.phone.includes(searchTerm));
    });

    if (filteredUsers.length === 0) {
      userTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px 0;">No users found.</td></tr>`;
      return;
    }

    filteredUsers.forEach(u => {
      const statusBadgeClass = u.status === "Active" ? "badge-completed" : "badge-cancelled";
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color: var(--primary);">${u.id}</strong></td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.phone || '<span style="color:var(--text-muted); font-style:italic;">N/A</span>'}</td>
        <td><span class="badge ${statusBadgeClass}">${u.status}</span></td>
        <td class="table-actions">
          <button class="btn-icon edit btn-edit-user" data-id="${u.id}" title="Edit"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn-icon delete btn-delete-user" data-id="${u.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      userTableBody.appendChild(tr);
    });

    // Attach listeners
    document.querySelectorAll(".btn-edit-user").forEach(btn => {
      btn.addEventListener("click", async () => await openEditModal(btn.dataset.id));
    });
    document.querySelectorAll(".btn-delete-user").forEach(btn => {
      btn.addEventListener("click", async () => await deleteUser(btn.dataset.id));
    });
    } catch(err) {
      console.error(err);
    }
  }

  // Open Modal for Create
  if (btnAddUser) {
    btnAddUser.addEventListener("click", () => {
      userForm.reset();
      userIdInput.value = "";
      userPasswordInput.required = true;
      userPasswordInput.placeholder = "Enter initial password";
      userModalTitle.textContent = "Register User";
      userModal.classList.add("active");
    });
  }

  // Close Modal
  function closeModal() {
    if (userModal) userModal.classList.remove("active");
  }
  if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
  if (btnCancelUser) btnCancelUser.addEventListener("click", closeModal);

  // Form Submit (Create & Update)
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = userIdInput.value;
      const userData = {
        name: userNameInput.value.trim(),
        email: userEmailInput.value.trim(),
        phone: userPhoneInput.value.trim(),
        status: userStatusInput.value
      };

      if (userPasswordInput.value) {
        userData.password = userPasswordInput.value;
      }

      try {
        if (id) {
          // Update
          await PetCareDB.usersManager.update(id, userData);
          toast("User details updated successfully!");
        } else {
          // Create
          await PetCareDB.usersManager.create(userData);
          toast("New user account registered!");
        }
        closeModal();
        await renderUsers();
      } catch (err) {
        toast(err.message, "error");
      }
    });
  }

  // Open Modal for Edit
  async function openEditModal(id) {
    const u = await PetCareDB.usersManager.getById(id);
    if (!u) return;

    userIdInput.value = u.id;
    userNameInput.value = u.name;
    userEmailInput.value = u.email;
    userPhoneInput.value = u.phone || "";
    userStatusInput.value = u.status;
    
    // Password is not required for update
    userPasswordInput.value = "";
    userPasswordInput.required = false;
    userPasswordInput.placeholder = "Leave blank to keep current password";
    
    userModalTitle.textContent = "Edit User Details";
    userModal.classList.add("active");
  }

  // Delete User
  async function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user account permanently?")) {
      try {
        await PetCareDB.usersManager.delete(id);
        toast("User account deleted!");
        await renderUsers();
      } catch (err) {
        toast(err.message, "error");
      }
    }
  }

  // Search input change listener
  if (userSearchInput) userSearchInput.addEventListener("input", renderUsers);

  // Initialize
  renderUsers();
});
