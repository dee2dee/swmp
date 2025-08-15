// logoutModalHandler.js
import { initKeluar } from '../services/logoutService.js';

export function showLogoutModal() {
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();
}

export function initBatal() {
    const logoutModalElement = document.getElementById('logoutModal');

    // Menambahkan event listener untuk menghapus backdrop setelah modal ditutup
    logoutModalElement.addEventListener('hidden.bs.modal', function () {
        // Cek dan hapus backdrop jika ada
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    });
}

export function initLogoutListeners() {
    document.getElementById('btnKeluar').addEventListener('click', initKeluar);
    document.getElementById('btnBatal').addEventListener('click', initBatal);
}

export function initArrowNavigation() {
    // Menambahkan event listener untuk navigasi dengan tombol panah kiri dan kanan
    document.getElementById('logoutModal').addEventListener('keydown', function (event) {
        // Pastikan modal dalam keadaan terbuka dan tombol yang ditekan adalah panah kiri atau kanan
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const btnBatal = document.getElementById('btnBatal'); // Tombol 'Batal'
            const btnKeluar = document.getElementById('btnKeluar'); // Tombol 'Keluar'

            if (event.key === "ArrowLeft") {
                // Fokus ke tombol 'Keluar' ketika tombol kiri ditekan
                btnBatal.focus();
            } else if (event.key === "ArrowRight") {
                // Fokus ke tombol 'Batal' ketika tombol kanan ditekan
                btnKeluar.focus();
            }
        }
    });
}