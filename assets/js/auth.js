class Auth {
    // Login menggunakan Firebase Authentication
    async login(email, password) {
        try {
            await authInstance.signInWithEmailAndPassword(email, password);
            return true;
        } catch (error) {
            console.error("Firebase Login Error:", error);
            throw error;
        }
    }

    // Logout menggunakan Firebase Authentication
    logout() {
        authInstance.signOut().then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error("Firebase Logout Error:", error);
            window.location.href = 'login.html';
        });
    }

    // Memeriksa apakah user saat ini sedang login
    isLoggedIn() {
        return authInstance.currentUser !== null;
    }

    // Mendapatkan data user yang aktif saat ini
    getCurrentUser() {
        const user = authInstance.currentUser;
        if (user) {
            return {
                email: user.email,
                // Gunakan displayName dari Firebase jika ada, jika tidak gunakan teks sebelum karakter '@' pada email
                fullname: user.displayName || user.email.split('@')[0]
            };
        }
        return null;
    }
}
