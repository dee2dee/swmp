// logoutService.js
export async function initKeluar() {
    try {
        const response = await fetch('/logout', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            console.log("Berhasil keluar");
            window.location.href = '/auth/login';
        } else {
            const errorData = await response.json();
            console.error("Gagal keluar:", errorData.message || 'Terjadi kesalahan');
            alert("Gagal keluar. Silakan coba lagi.");
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat logout:", error);
        alert("Terjadi kesalahan. Silakan coba lagi.");
    }
}