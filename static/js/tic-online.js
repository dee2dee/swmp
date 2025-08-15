document.addEventListener("DOMContentLoaded", () => {
    // Element selectors
    const inputKodeBooking = document.getElementById('kodeBooking');
    const btnKonfrCheckIn = document.getElementById('btnKonfrCheckIn');

    // Style input
    inputKodeBooking.focus();
    inputKodeBooking.style.textTransform = "uppercase";
    inputKodeBooking.style.fontWeight = "bold";

    // Helper: Focus element on Enter/Arrow
    function focusOnKey(event, key, target) {
        if (event.key === key) {
            event.preventDefault();
            target.focus();
        }
    }

    // Helper: Show warning modal
    function showWarningModal({ message, kodeTiket, tglPesan, namaPemesan, bookingStatus }) {
        const pesanModalEl = document.getElementById("pesanModal");
        const pesanIsiEl = document.getElementById("pesanIsi");

        let html = `
            <div style="font-size: 14px; color: #333;">
                <p style="font-size: 16px; color: #dc3545;">${message}</p>
        `;

        if (kodeTiket || tglPesan || namaPemesan || bookingStatus) {
            html += `<hr style="margin: 10px 0;"><dl class="row mb-0">`;
            if (kodeTiket) html += `<dt class="col-5">Kode Tiket</dt><dd class="col-7"><strong>${kodeTiket}</strong></dd>`;
            if (tglPesan) html += `<dd class="col-5">Tanggal Pemesanan</dd><dd class="col-7">${tglPesan}</dd>`;
            if (namaPemesan) html += `<dd class="col-5">Nama Pemesan</dd><dd class="col-7">${namaPemesan}</dd>`;
            if (bookingStatus) {
                const badgeClass = bookingStatus === 'Kadaluarsa' ? 'bg-danger' : 'bg-secondary';
                html += `<dt class="col-5">Booking Status</dt><dd class="col-7"><span class="badge ${badgeClass}">${bookingStatus}</span></dd>`;
            }
            html += `</dl>`;
        }
        html += `</div>`;
        pesanIsiEl.innerHTML = html;

        const pesanModal = new bootstrap.Modal(pesanModalEl);
        pesanModal.show();

        // Focus close button when modal shown
        pesanModalEl.addEventListener('shown.bs.modal', () => {
            const btnTutup = document.getElementById("btnTutup");
            if (btnTutup) btnTutup.focus();
        }, { once: true });

        // Reset input after modal closed
        pesanModalEl.addEventListener('hidden.bs.modal', () => {
            inputKodeBooking.value = '';
            inputKodeBooking.focus();
        }, { once: true });
    }

    // Helper: Show confirmation modal
    function showConfirmationModal(htmlIsi, kodeTiket = null) {
        const konfirmasiModalEl = document.getElementById("konfirmasiModal");
        const konfirmasiIsiEl = document.getElementById("konfirmasiIsi");

        konfirmasiIsiEl.innerHTML = htmlIsi;
        const modalInstance = new bootstrap.Modal(konfirmasiModalEl);
        modalInstance.show();

        konfirmasiModalEl.addEventListener('shown.bs.modal', () => {
            const oldBtn = document.getElementById("btnCheckIn");
            if (!oldBtn) return;
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.replaceWith(newBtn);
            newBtn.focus();
            if (kodeTiket) newBtn.setAttribute("data-kode", kodeTiket);

            newBtn.addEventListener("click", () => handleCheckIn(newBtn, kodeTiket, modalInstance));
        }, { once: true });

        konfirmasiModalEl.addEventListener('hidden.bs.modal', () => {
            inputKodeBooking.value = '';
            inputKodeBooking.focus();
        }, { once: true });
    }

    // Helper: Show success modal
    function showSuccessModal(message) {
        const modalEl = document.getElementById("modalSukses");
        const modalIsi = document.getElementById("modalIsi");
        const btnTutup = document.getElementById("btnTutup");

        if (!modalEl || !modalIsi || !btnTutup) return;
        modalIsi.innerHTML = message;

        const modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.show();

        btnTutup.onclick = () => {
            modalInstance.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            document.body.classList.remove('modal-open');
            document.body.style = "";
        };

        modalEl.addEventListener("hidden.bs.modal", () => {
            setTimeout(() => inputKodeBooking.focus(), 300);
        }, { once: true });
    }

    // Check-in handler
    async function handleCheckIn(btn, kode, modalInstance) {
        if (!kode) return;
        btn.disabled = true;
        btn.textContent = "Processing...";
        await new Promise(resolve => setTimeout(resolve, 50));
        try {
            const res = await fetch(`/checkin/${kode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kode_booking: kode }),
            });
            const data = await res.json();
            if (!res.ok) {
                showWarningModal({
                    message: data.message || "Terjadi kesalahan saat proses check-in.",
                    kodeTiket: data.kode_tiket || "",
                    tglPesan: data.tgl_pesan || "",
                });
            } else {
                if (modalInstance) modalInstance.hide();
                setTimeout(() => showSuccessModal("Check-in berhasil!"), 300);
            }
        } catch {
            showWarningModal({ message: "Terjadi kesalahan jaringan saat proses check-in." });
        } finally {
            btn.disabled = false;
            btn.textContent = "Check-in";
            inputKodeBooking.value = "";
            inputKodeBooking.focus();
        }
    }

    // Main check-in confirmation logic
    async function handleKonfirmasiCheckIn() {
        const kode = inputKodeBooking.value.trim();
        if (!kode) {
            showWarningModal({ message: "Kode booking tidak boleh kosong.!" });
            return;
        }
        try {
            const res = await fetch(`/booking/${kode}`);
            const data = await res.json();
            if (!res.ok) {
                showWarningModal({
                    message: data.message || "Tiket tidak valid.",
                    kodeTiket: data.kode_tiket || data.kode_booking || null,
                    tglPesan: data.tgl_pesan || data.tgl_pemesanan || null,
                    namaPemesan: data.nama_pemesan || null,
                    bookingStatus: data.booking_status || null,
                });
                return;
            }
            // Prepare confirmation HTML
            const htmlKonfirmasi = `
                <div>
                    <h5 class="mb-3">🎟️ Tiket Masuk</h5>
                    <hr class="my-3">
                    <dl class="row mb-0">
                        <dt class="col-6">Kode Tiket</dt>
                        <dd class="col-6"><strong>${data.kode_tiket || "-"}</strong></dd>
                        <dt class="col-6" style="font-weight: normal;color: #555;">Tgl Pesan</dt>
                        <dd class="col-6"><small class="text-muted">${data.tgl_pesan || "-"}</small></dd>
                        <dt class="col-6" style="font-weight: normal;color: #555;">Nama Pemesan</dt>
                        <dd class="col-6">${data.nama_pemesan || "-"}</dd>
                        <dt class="col-6" style="font-weight: normal;color: #555;">Dewasa</dt>
                        <dd class="col-6">${data.dewasa || "-"}</dd>
                        <dt class="col-6" style="font-weight: normal;color: #555;">Anak</dt>
                        <dd class="col-6">${data.anak || "-"}</dd>
                        <dt class="col-6" style="font-weight: normal;color: #555;">Jumlah Pengunjung</dt>
                        <dd class="col-6">${data.jml_pengunjung || "-"}</dd>
                        <dt class="col-6" style="font-weight: normal;color: #555;">Metode Pembayaran</dt>
                        <dd class="col-6">${data.metode_pem || "-"}</dd>
                        <dt class="col-6">Payment Status</dt>
                        <dd class="col-6"><span class="badge bg-success">${data.payment_status || "N/A"}</span></dd>
                        <dt class="col-6">Booking Status</dt>
                        <dd class="col-6"><span class="badge bg-info">${data.booking_status || "N/A"}</span></dd>
                    </dl>
                </div>
            `;
            showConfirmationModal(htmlKonfirmasi, data.kode_tiket);
        } catch {
            showWarningModal({ message: "Terjadi kesalahan jaringan. Silakan coba lagi." });
        }
    }

    // Event listeners
    inputKodeBooking.addEventListener('keydown', e => {
        focusOnKey(e, 'Enter', btnKonfrCheckIn);
        focusOnKey(e, 'ArrowRight', btnKonfrCheckIn);
    });
    btnKonfrCheckIn.addEventListener('keydown', e => focusOnKey(e, 'ArrowLeft', inputKodeBooking));
    btnKonfrCheckIn.addEventListener('click', handleKonfirmasiCheckIn);
    btnKonfrCheckIn.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleKonfirmasiCheckIn();
        }
    });
});