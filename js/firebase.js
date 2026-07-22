/**
 * PetCareBooking Database Management Layer (firebase.js)
 * FULL FIREBASE SDK MIGRATION
 */

// --- LIVE FIREBASE INTEGRATION ---
let liveDb = null;
let liveAuth = null;
let liveStorage = null;
let liveFirestoreFns = null;
let liveAuthFns = null;
let liveStorageFns = null;

// Ensure Firebase initializes before app logic runs
const firebaseInitPromise = (async function initLiveFirebase() {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js");
    const firestore = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");
    const auth = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js");
    const storage = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js");

    const firebaseConfig = {
      apiKey: "AIzaSyBhrDKZV_BDbDy9hDmcU6_MneQKx8aiijE",
      authDomain: "petcare-e518d.firebaseapp.com",
      projectId: "petcare-e518d",
      storageBucket: "petcare-e518d.firebasestorage.app",
      messagingSenderId: "1024623908060",
      appId: "1:1024623908060:web:a294146194b01407991019",
      measurementId: "G-FLQHNL3EHT"
    };

    const app = initializeApp(firebaseConfig);
    liveDb = firestore.getFirestore(app);
    liveAuth = auth.getAuth(app);
    liveStorage = storage.getStorage(app);
    liveFirestoreFns = firestore;
    liveAuthFns = auth;
    liveStorageFns = storage;
    window.LiveFirestore = firestore;
    window.LiveStorage = storage;
    
    console.log("Firebase SDK Initialized (Full Backend Mode)");
  } catch(e) {
    console.error("Failed to connect to Live Firebase:", e);
  }
})();

// Database Interface Object
const DB = {
  // Helper to ensure Firebase is ready
  async _ready() {
    await firebaseInitPromise;
  },

  // Authentication Module
  auth: {
    async login(email, password) {
      await DB._ready();
      try {
        const userCredential = await liveAuthFns.signInWithEmailAndPassword(liveAuth, email, password);
        const q = liveFirestoreFns.query(liveFirestoreFns.collection(liveDb, "users"), liveFirestoreFns.where("email", "==", email.toLowerCase()));
        const snap = await liveFirestoreFns.getDocs(q);
        
        if (!snap.empty) {
          const userData = snap.docs[0].data();
          if (userData.status !== "Active") {
            await liveAuthFns.signOut(liveAuth);
            return { success: false, message: "This account has been deactivated." };
          }
          return { success: true, user: { id: userCredential.user.uid, ...userData } };
        } else {
          // If no user doc found, create a basic one or reject
          return { success: true, user: { id: userCredential.user.uid, email: email, role: 'user', name: 'User' } };
        }
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async logout() {
      await DB._ready();
      await liveAuthFns.signOut(liveAuth);
      const path = window.location.pathname;
      const redirectPath = path.includes("/admin/") || path.includes("/user/") ? "../login.html" : "login.html";
      window.location.href = redirectPath;
    },

    async getCurrentUser() {
      await DB._ready();
      return new Promise((resolve) => {
        const unsubscribe = liveAuthFns.onAuthStateChanged(liveAuth, async (user) => {
          unsubscribe();
          if (!user || user.isAnonymous) resolve(null);
          else {
            try {
               const q = liveFirestoreFns.query(liveFirestoreFns.collection(liveDb, "users"), liveFirestoreFns.where("email", "==", user.email));
               const snap = await liveFirestoreFns.getDocs(q);
               if(!snap.empty) {
                  resolve({ id: user.uid, ...snap.docs[0].data() });
               } else {
                  resolve({ id: user.uid, email: user.email, role: 'user', name: 'User' });
               }
            } catch(e) { resolve(null); }
          }
        });
      });
    },

    async checkSession(allowedRoles = []) {
      const user = await this.getCurrentUser();
      if (!user) {
        const path = window.location.pathname;
        const redirectPath = path.includes("/admin/") || path.includes("/user/") ? "../login.html" : "login.html";
        window.location.href = redirectPath;
        return null;
      }
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        window.location.href = user.role === "admin" ? "../admin/dashboard.html" : "../user/dashboard.html";
        return null;
      }
      document.body.classList.add("session-loaded");
      return user;
    }
  },

  // Storage Module
  storage: {
    async uploadFile(file, path) {
      await DB._ready();
      const storageRef = liveStorageFns.ref(liveStorage, path || `uploads/${file.name}`);
      await liveStorageFns.uploadBytes(storageRef, file);
      const url = await liveStorageFns.getDownloadURL(storageRef);
      return url;
    }
  },

  // User CRUD (Admins only)
  usersManager: {
    async getAll() {
      await DB._ready();
      const q = liveFirestoreFns.query(liveFirestoreFns.collection(liveDb, "users"), liveFirestoreFns.where("role", "==", "user"));
      const snap = await liveFirestoreFns.getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    async getById(id) {
      await DB._ready();
      const docSnap = await liveFirestoreFns.getDoc(liveFirestoreFns.doc(liveDb, "users", id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    async create(data) {
      await DB._ready();
      // Since we can't create Auth users without admin SDK, we just create the document for now.
      const newUser = {
        name: data.name,
        email: data.email,
        role: "user",
        phone: data.phone || "",
        status: data.status || "Active",
        createdAt: new Date().toISOString()
      };
      const docRef = await liveFirestoreFns.addDoc(liveFirestoreFns.collection(liveDb, "users"), newUser);
      return { id: docRef.id, ...newUser };
    },
    async ensureUserExists(userData) {
      await DB._ready();
      const q = liveFirestoreFns.query(liveFirestoreFns.collection(liveDb, "users"), liveFirestoreFns.where("email", "==", userData.email.toLowerCase()));
      const snap = await liveFirestoreFns.getDocs(q);
      if (snap.empty) {
        await liveFirestoreFns.addDoc(liveFirestoreFns.collection(liveDb, "users"), {
          name: userData.name,
          email: userData.email.toLowerCase(),
          role: userData.role || "user",
          status: "Active",
          createdAt: new Date().toISOString()
        });
      }
    },
    async update(id, data) {
      await DB._ready();
      await liveFirestoreFns.updateDoc(liveFirestoreFns.doc(liveDb, "users", id), data);
      return { id, ...data };
    },
    async delete(id) {
      await DB._ready();
      await liveFirestoreFns.deleteDoc(liveFirestoreFns.doc(liveDb, "users", id));
      return true;
    }
  },

  // Owners CRUD
  owners: {
    async getAll() {
      await DB._ready();
      const snap = await liveFirestoreFns.getDocs(liveFirestoreFns.collection(liveDb, "owners"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    async getById(id) {
      await DB._ready();
      const docSnap = await liveFirestoreFns.getDoc(liveFirestoreFns.doc(liveDb, "owners", id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    async create(data) {
      await DB._ready();
      const newOwner = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address
      };
      const docRef = await liveFirestoreFns.addDoc(liveFirestoreFns.collection(liveDb, "owners"), newOwner);
      return { id: docRef.id, ...newOwner };
    },
    async update(id, data) {
      await DB._ready();
      await liveFirestoreFns.updateDoc(liveFirestoreFns.doc(liveDb, "owners", id), data);
      return { id, ...data };
    },
    async delete(id) {
      await DB._ready();
      await liveFirestoreFns.deleteDoc(liveFirestoreFns.doc(liveDb, "owners", id));
      return true;
    }
  },

  // Pets CRUD
  pets: {
    async getAll() {
      await DB._ready();
      const snap = await liveFirestoreFns.getDocs(liveFirestoreFns.collection(liveDb, "pets"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    async getById(id) {
      await DB._ready();
      const docSnap = await liveFirestoreFns.getDoc(liveFirestoreFns.doc(liveDb, "pets", id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    async create(data) {
      await DB._ready();
      const newPet = {
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        weight: data.weight,
        ownerId: data.ownerId,
        photo: data.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500"
      };
      const docRef = await liveFirestoreFns.addDoc(liveFirestoreFns.collection(liveDb, "pets"), newPet);
      return { id: docRef.id, ...newPet };
    },
    async update(id, data) {
      await DB._ready();
      await liveFirestoreFns.updateDoc(liveFirestoreFns.doc(liveDb, "pets", id), data);
      return { id, ...data };
    },
    async delete(id) {
      await DB._ready();
      await liveFirestoreFns.deleteDoc(liveFirestoreFns.doc(liveDb, "pets", id));
      return true;
    }
  },

  // Bookings CRUD
  bookings: {
    async getAll() {
      await DB._ready();
      const currentUser = await DB.auth.getCurrentUser();
      if (!currentUser) throw new Error("Authentication required to read bookings.");
      
      let q;
      if (currentUser.role === "admin") {
         q = liveFirestoreFns.collection(liveDb, "bookings");
      } else {
         q = liveFirestoreFns.query(liveFirestoreFns.collection(liveDb, "bookings"), liveFirestoreFns.where("userId", "==", currentUser.id));
      }
      const snap = await liveFirestoreFns.getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    async create(data) {
      await DB._ready();
      const currentUser = await DB.auth.getCurrentUser();
      if (!currentUser) throw new Error("Authentication required to create a booking.");
      
      const newBooking = {
        userId: currentUser.id,
        petId: data.petId || "",
        ownerId: data.ownerId || currentUser.id,
        service: data.service,
        date: data.date,
        time: data.time || "",
        status: data.status || "Pending",
        notes: data.notes || "",
        timestamp: liveFirestoreFns.serverTimestamp()
      };
      const docRef = await liveFirestoreFns.addDoc(liveFirestoreFns.collection(liveDb, "bookings"), newBooking);
      return { id: docRef.id, ...newBooking };
    },
    async update(id, data) {
      await DB._ready();
      await liveFirestoreFns.updateDoc(liveFirestoreFns.doc(liveDb, "bookings", id), data);
      return { id, ...data };
    },
    async delete(id) {
      await DB._ready();
      await liveFirestoreFns.deleteDoc(liveFirestoreFns.doc(liveDb, "bookings", id));
      return true;
    }
  },

  // Messages CRUD
  messages: {
    async getAll() {
      await DB._ready();
      const currentUser = await DB.auth.getCurrentUser();
      if (!currentUser) throw new Error("Authentication required to read messages.");
      
      let q;
      if (currentUser.role === "admin") {
         q = liveFirestoreFns.collection(liveDb, "messages");
      } else {
         q = liveFirestoreFns.query(liveFirestoreFns.collection(liveDb, "messages"), liveFirestoreFns.where("firebaseUid", "==", currentUser.id));
      }
      const snap = await liveFirestoreFns.getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    async create(data) {
      await DB._ready();
      const currentUser = await DB.auth.getCurrentUser();
      const uid = currentUser ? currentUser.id : "anonymous";
      
      const newMessage = {
        localUserId: uid,
        firebaseUid: liveAuth.currentUser ? liveAuth.currentUser.uid : uid,
        text: data.text,
        timestamp: liveFirestoreFns.serverTimestamp()
      };
      const docRef = await liveFirestoreFns.addDoc(liveFirestoreFns.collection(liveDb, "messages"), newMessage);
      return { id: docRef.id, ...newMessage };
    },
    async delete(id) {
      await DB._ready();
      await liveFirestoreFns.deleteDoc(liveFirestoreFns.doc(liveDb, "messages", id));
      return true;
    }
  },

  // Dashboard Stats
  async getStats() {
    const [pets, owners, bookings, users] = await Promise.all([
      DB.pets.getAll(),
      DB.owners.getAll(),
      DB.bookings.getAll(),
      DB.usersManager.getAll()
    ]);

    const statusCounts = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 });

    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
      .slice(0, 5)
      .map(b => {
        const pet = pets.find(p => p.id === b.petId);
        const owner = owners.find(o => o.id === b.ownerId);
        return {
          ...b,
          petName: pet ? pet.name : "Unknown Pet",
          ownerName: owner ? owner.name : "Unknown Owner"
        };
      });

    return {
      totalPets: pets.length,
      totalOwners: owners.length,
      totalBookings: bookings.length,
      totalUsers: users.length,
      statusCounts,
      recentBookings
    };
  }
};

window.PetCareDB = DB;
