document.addEventListener('DOMContentLoaded', function () {
    const namaInput = document.getElementById('namaPemesan');
    const telpInput = document.getElementById('noTelepon');
    const tglInput = document.querySelector('#tglKunjungan');
    const dewasaInput = document.getElementById('dewasa');
    const anakInput = document.getElementById('anak');
    const btnProses = document.getElementById('btnProses');
    const btnReset = document.getElementById('btnReset');
    const kodeBooking = document.getElementById('kodeBooking');
    const kodeTrxId = document.getElementById('kodeTrxID');
    const noInvoiceInput = document.getElementById("noInvoice");

    namaInput.focus();

    // Fetch payment info from backend (no hardcoded credentials)
    let paymentInfo = { bank: '', account: '', name: '' };
    fetch('/payment-info')
        .then(res => res.json())
        .then(data => { paymentInfo = data; })
        .catch(() => { paymentInfo = { bank: '', account: '', name: '' }; });

    function fetchAndSet(url, cb) {
        fetch(url)
            .then(res => res.json())
            .then(cb)
            .catch(console.error);
    }

    fetchAndSet("/transaksi-id", data => {
        kodeBooking.value = data.kode_booking;
        kodeTrxId.value = data.trx_id;
    });

    fetchAndSet("/price", data => {
        document.getElementById('hargaDewasa').value = `Rp ${parseFloat(data.harga_dewasa).toLocaleString('id-ID')}`;
        document.getElementById('hargaAnak').value = `Rp ${parseFloat(data.harga_anak).toLocaleString('id-ID')}`;
    });

    fetchAndSet("/invoice", data => {
        noInvoiceInput.value = data.no_invoice;
    });

    function refreshKodeBooking() {
        fetchAndSet("/transaksi-id", data => {
            kodeBooking.value = data.kode_booking;
            kodeTrxId.value = data.trx_id;
        });
        fetchAndSet('api/capacities', data => {
            document.getElementById('quotaDewasa').textContent = data.max_dewasa;
            document.getElementById('quotaAnak').textContent = data.max_anak;
            dewasaInput.addEventListener('input', updateKuota);
            anakInput.addEventListener('input', updateKuota);
        });
    }

    function resetInput() {
        [namaInput, telpInput, dewasaInput, anakInput].forEach(input => input.value = '');
        tglInstance.altInput.value = 'Pilih Tanggal';
    }

    const tglInstance = flatpickr("#tglKunjungan", {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d F Y",
        allowInput: true,
        disableMobile: true,
        clickOpens: false,
        onClose: function(selectedDates) {
            if (selectedDates.length > 0) dewasaInput.focus();
        }
    });

    namaInput.addEventListener('input', () => {
        namaInput.value = namaInput.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    });
    telpInput.addEventListener('input', () => {
        telpInput.value = telpInput.value.replace(/[^0-9]/g, '');
    });
    [dewasaInput, anakInput].forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '').slice(0, 3);
        });
    });

    function handleKey(event, map) {
        if (map[event.key]) {
            event.preventDefault();
            map[event.key].focus();
        }
    }

    namaInput.addEventListener('keydown', e => handleKey(e, { Enter: telpInput, ArrowDown: telpInput }));
    telpInput.addEventListener('keydown', e => handleKey(e, { Enter: tglInstance.altInput, ArrowDown: tglInstance.altInput, ArrowUp: namaInput }));
    dewasaInput.addEventListener('keydown', e => handleKey(e, { Enter: anakInput, ArrowDown: anakInput, ArrowUp: tglInstance.altInput }));
    anakInput.addEventListener('keydown', e => handleKey(e, { Enter: btnProses, ArrowUp: dewasaInput }));
    btnProses.addEventListener('keydown', e => handleKey(e, { ArrowUp: anakInput, ArrowRight: btnReset }));
    btnReset.addEventListener('keydown', e => handleKey(e, { ArrowLeft: btnProses }));

    tglInstance.config.onChange.push(() => dewasaInput.focus());
    tglInstance.altInput.addEventListener('focus', function () {
        tglInstance.open();
        setTimeout(() => {
            const calendar = document.querySelector('.flatpickr-calendar');
            if (calendar && calendar.classList.contains('open')) {
                const activeDay = calendar.querySelector('.flatpickr-day.today') || calendar.querySelector('.flatpickr-day.selected');
                if (activeDay) activeDay.focus();
            }
        }, 50);
    });
    tglInstance.altInput.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            tglInstance.open();
            setTimeout(() => {
                const calendar = document.querySelector('.flatpickr-calendar');
                if (calendar && calendar.classList.contains('open')) {
                    const activeDay = calendar.querySelector('.flatpickr-day.today') || calendar.querySelector('.flatpickr-day.selected');
                    if (activeDay) activeDay.focus();
                }
            }, 50);
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (tglInstance.selectedDates.length > 0) dewasaInput.focus();
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            telpInput.focus();
        }
    });

    btnReset.addEventListener('click', () => {
        [namaInput, telpInput, dewasaInput, anakInput].forEach(input => {
            input.value = '';
            input.classList.remove('is-invalid');
        });
        tglInput._flatpickr.clear();
        tglInput.classList.remove('is-invalid');
        tglInput._flatpickr.altInput.classList.remove('is-invalid');
        namaInput.focus();
    });

    function validateInputs() {
        let valid = true;
        [namaInput, telpInput, tglInput, dewasaInput, anakInput].forEach(el => el.classList.remove('is-invalid'));
        tglInput.classList.remove('is-invalid');
        if (tglInput._flatpickr) tglInput._flatpickr.altInput.classList.remove('is-invalid');
        if (!/^[a-zA-Z\s]+$/.test(namaInput.value.trim())) {
            namaInput.classList.add('is-invalid'); valid = false;
        }
        if (!/^\d+$/.test(telpInput.value.trim())) {
            telpInput.classList.add('is-invalid'); valid = false;
        }
        if (tglInput.value.trim() === "") {
            tglInput.classList.add('is-invalid');
            tglInstance.altInput.classList.add('is-invalid');
            valid = false;
        }
        if (!/^\d+$/.test(dewasaInput.value.trim())) {
            dewasaInput.classList.add('is-invalid'); valid = false;
        }
        if (!/^\d+$/.test(anakInput.value.trim())) {
            anakInput.classList.add('is-invalid'); valid = false;
        }
        return valid;
    }

    function tampilkanModalKonfirmasi(htmlIsi, noInvoice) {
        const konfirmasiModalEl = document.getElementById("konfirmasiModal");
        const konfirmasiIsiEl = document.getElementById("konfirmasiIsi");
        const btnTutup = document.getElementById("btnTutup");
        konfirmasiIsiEl.innerHTML = htmlIsi;
        const modalInstance = new bootstrap.Modal(konfirmasiModalEl);
        modalInstance.show();
        const onModalHidden = () => {
            namaInput.focus();
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            konfirmasiModalEl.removeEventListener('hidden.bs.modal', onModalHidden);
        };
        konfirmasiModalEl.addEventListener('hidden.bs.modal', onModalHidden, { once: true });
        const onShown = () => {
            const oldBtn = document.getElementById("btnInvoice");
            if (!oldBtn) return;
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.replaceWith(newBtn);
            newBtn.focus();
            newBtn.addEventListener("click", () => {
                const elementToPrint = document.getElementById("konfirmasiIsi");
                if (!elementToPrint) return;
                html2pdf()
                    .set({ margin: 10, filename: `${noInvoice}.pdf`, html2canvas: { scale: 3 }, jsPDF: { unit: 'mm', format: 'a4' }})
                    .from(elementToPrint)
                    .save();
            });
            konfirmasiModalEl.removeEventListener("shown.bs.modal", onShown);
        };
        konfirmasiModalEl.addEventListener("shown.bs.modal", onShown, { once: true });
        if (btnTutup) {
            btnTutup.addEventListener("click", () => {
                modalInstance.hide();
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
                document.body.classList.remove('modal-open');
                document.body.style = "";
            });
        }
    }

    btnProses.addEventListener('click', function (e) {
        e.preventDefault();
        if (!validateInputs()) return;
        const data = {
            kodeBooking: kodeBooking.value,
            transaksiId: kodeTrxId.value,
            namaPemesan: namaInput.value,
            noTelepon: telpInput.value,
            tglKunjungan: tglInput.value,
            dewasa: parseInt(dewasaInput.value),
            anak: parseInt(anakInput.value),
            noInvoice: noInvoiceInput.value,
        };
        fetch('/reservation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            if (response.message === "Pemesanan berhasil") {
                const htmlKonfirmasi = `
                    <div>
                        <div style="font-size: 13px;">
                            <h5 class="mb-3">Proforma Invoice</h5>
                            <hr style="border: none; border-top: 1px solid #000; margin: 10px 0;">
                            <div class="row mb-2">
                                <div class="col-3 fw-bold">Nomor Invoice</div>
                                <div class="col-8">${response.no_invoice}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-3 fw-bold">Tgl Pemesanan</div>
                                <div class="col-8"></div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-3 fw-bold">Tanggal Kunjungan</div>
                                <div class="col-8">${data.tglKunjungan}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-3 fw-bold">Nama Pemesan</div>
                                <div class="col-8">${data.namaPemesan}</div>
                            </div>
                        </div>
                        <div style="font-size: 13px; margin-top: 30px;">
                            <p><b>Detail Pemesanan</b>
                        </div>
                        <table class="table mt-0">
                            <thead>
                                <tr>
                                    <th>Kategori</th>
                                    <th>Qty</th>
                                    <th>Harga</th>
                                    <th style="text-align: right">Total Harga</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Dewasa</td>
                                    <td>${data.dewasa}</td>
                                    <td>${response.harga_dewasa}</td>
                                    <td>${response.total_harga1}</td>
                                </tr>
                                <tr>
                                    <td>Anak</td>
                                    <td>${data.anak}</td>
                                    <td>${response.harga_anak}</td>
                                    <td>${response.total_harga2}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="3" class="text-end">Sub Total</th>
                                    <th>${response.sub_total}</th>
                                </tr>
                                <tr>
                                    <th colspan="3" class="text-end">Diskon</th>
                                    <th>0</th>
                                </tr>
                                <tr>
                                    <th colspan="3" class="text-end">Total Bayar</th>
                                    <th>${response.total_bayar}</th>
                                </tr>
                            </tfoot>
                        </table>
                        <div style="font-size: 12px; margin-top: 20px;">
                            <p><b>Notes:</b><br>
                            Silakan lakukan pembayaran dalam 1 jam setelah pemesanan. Tiket akan dibatalkan otomatis jika melewati batas waktu.</p>
                            <p><b>Pembayaran via:</b><br>
                            ${paymentInfo.bank ? `${paymentInfo.bank} - ${paymentInfo.account} a.n. ${paymentInfo.name}` : '-'}</p>
                            <p>Konfirmasi pembayaran:<br>
                            WhatsApp: 0857-6824-4475<br>
                            Email: dedeeapr17@gmail.com</p>
                        </div>
                    </div>
                `;
                tampilkanModalKonfirmasi(htmlKonfirmasi, response.no_invoice);
                resetInput();
                refreshKodeBooking();
                fetchAndSet("/invoice", data => {
                    noInvoiceInput.value = data.no_invoice;
                });
            } else {
                alert("Gagal: " + response.error);
            }
        })
        .catch(error => {
            console.error("Error", error);
            alert("Terjadi kesalahan server.");
        });
    });
});