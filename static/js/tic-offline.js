// --- CONSTANTS & STATE ---
let kuotaAwalDewasa = 0;
let kuotaAwalAnak = 0;
let inputBermasalah = null;
let modalInstance = null;

// --- DOM ELEMENTS ---
const dom = {};
function cacheDom() {
    dom.namaPemesanInput = document.getElementById('namaPemesan');
    dom.dewasaInput = document.getElementById('dewasa');
    dom.anakInput = document.getElementById('anak');
    dom.bayarTunaiElement = document.getElementById('bayarTunai');
    dom.inputModalCash = document.getElementById('modalCash');
    dom.btnKonfirmasiEl = document.getElementById('btnKonfirmasi');
    dom.btnCetakEl = document.getElementById('btnCetak');
    dom.btnBatalCetakEl = document.getElementById('btnBatalCetak');
    dom.btnBatalEl = document.getElementById('btnBatal');
    dom.totalBayarElement = document.getElementById('totalBayar');
    dom.detailTable = document.getElementById('detailTable');
    dom.subTotalElement = document.getElementById('subTotal');
    dom.confirmationModalElement = document.getElementById('confirmationModal');
    dom.namaKasir = document.getElementById('kasir');
    dom.kodeBookingInput = document.getElementById('kodeBooking');
    dom.kodeTrxIDInput = document.getElementById('kodeTrxID');
    dom.totalEl = document.getElementById('total');
    dom.discountEl = document.getElementById('diskon');
    dom.modalKembaliElement = document.getElementById('modalKembali');
    dom.modalKonfirmasiBayarEl = document.getElementById('modalKonfirmasiBayar');
    dom.modalTotalElement = document.getElementById('modalTotal');
    dom.quotaDewasa = document.getElementById('quotaDewasa');
    dom.quotaAnak = document.getElementById('quotaAnak');
    dom.printContent = document.getElementById('printContent');
    dom.printSection = document.getElementById('printSection');
    dom.btnErrClose = document.getElementById('btnErrClose');
    dom.modalKosong = document.getElementById('modalKosong');
    dom.closeModalKosong = document.getElementById('closeModalKosong');
    dom.kuotaModal = document.getElementById('kuotaModal');
    dom.modalKuotaBody = document.getElementById('modalKuotaBody');
    dom.btnTutup = document.getElementById('btnTutup');
    dom.previewModalEl = document.getElementById('previewModal');
}

// --- UTILS ---
function formatRupiah(angka) {
    let value = angka.replace(/[^\d]/g, '');
    let formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return 'Rp. ' + formatted;
}
const rupiah = n => (isNaN(parseFloat(n)) ? '0' : parseFloat(n).toLocaleString('id-ID'));
function centerText(text, width = 32) {
    const space = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(space) + text;
}
function formatLine(left, right, width = 32) {
    const space = width - left.length - right.length;
    return left + ' '.repeat(space > 0 ? space : 0) + right;
}

// --- KEYBOARD HANDLERS ---
function validateInput(event) {
    if (!/[\d]/.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
}
function handleEnterKey(event, nextElement) {
    if (event.key === 'Enter') {
        event.preventDefault();
        nextElement.focus();
    }
}
function handleArrowUpKey(event, previousElement) {
    if (event.key === "ArrowUp") {
        event.preventDefault();
        previousElement.focus();
    }
}
function handleArrowDownKey(event, nextElement) {
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        nextElement.focus();
    }
}
function handleArrowKey(event, previousElement, nextElement) {
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousElement.focus();
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextElement.focus();
    }
}
function handleArrowRight(event, nextElement) {
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextElement.focus();
    }
}
function handleArrowLeft(event, previousElement) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previousElement.focus();
    }
}

// --- UI UPDATE FUNCTIONS ---
async function updateTotalBayar(event) {
    const dewasa = parseInt(dom.dewasaInput.value) || 0;
    const anak = parseInt(dom.anakInput.value) || 0;
    if (event && event.target) {
        let value = event.target.value.replace(/\D/g, '');
        value = value.replace(/^0+(?=\d)/, '');
        event.target.value = value === '' ? '0' : value;
    }
    try {
        const response = await fetch(`/total-bayar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dewasa, anak })
        });
        const data = await response.json();
        const hargaDewasa = data.hargaDewasa || 0;
        const hargaAnak = data.hargaAnak || 0;
        const totalBayarTmp = data.total_bayar_tmp;
        const totalBayarDiskon = data.total_bayar_diskon;
        dom.totalBayarElement.innerHTML = `Rp. ${totalBayarDiskon.toLocaleString('id-ID')}`;
        dom.subTotalElement.innerHTML = `${totalBayarTmp.toLocaleString('id-ID')}`;
        dom.discountEl.innerHTML = anak > 0 ? `${data.diskon.toLocaleString('id-ID')}` : '0';
        dom.bayarTunaiElement.innerHTML = "Bayar Rp. " + totalBayarDiskon.toLocaleString('id-ID');
        dom.totalEl.innerHTML = `${totalBayarDiskon.toLocaleString('id-ID')}`;
        dom.detailTable.innerHTML = '';
        if (dewasa > 0) dom.detailTable.appendChild(makeRow('Dewasa', dewasa, hargaDewasa));
        if (anak > 0) dom.detailTable.appendChild(makeRow('Anak', anak, hargaAnak));
    } catch (error) {
        console.error('Error fetching total:', error);
    }
    dom.quotaDewasa.textContent = kuotaAwalDewasa - dewasa;
    dom.quotaAnak.textContent = kuotaAwalAnak - anak;
}
function makeRow(label, qty, price) {
    const row = document.createElement('tr');
    row.id = `row${label}`;
    row.innerHTML = `
        <td>${label}</td>
        <td>${qty}</td>
        <td>${price.toLocaleString('id-ID')}</td>
        <td></td>
        <td style="text-align: right;padding-right: 20px;">${(qty * price).toLocaleString('id-ID')}</td>
    `;
    return row;
}
function tampilkanStruk(data) {
    let tiketMasukStr = 'TIKET MASUK\n';
    if (data.dewasa > 0) tiketMasukStr += formatLine(`Dewasa  x  ${data.dewasa}   ${rupiah(data.harga1)}`, rupiah(data.dewasa * data.harga1)) + '\n';
    if (data.anak > 0) tiketMasukStr += formatLine(`Anak    x  ${data.anak}   ${rupiah(data.harga2)}`, rupiah(data.anak * data.harga2));
    const struk = `
${centerText('KOLAM RENANG CERIA', 32)}
${centerText('Jl. Kenanga No. 45, Ciputat')}
${centerText('Telp. 0857-6824-4475')}
${'-'.repeat(32)}
${formatLine(data.transaksiId, data.waktu)}
${'-'.repeat(32)}
${data.tanggal}
KASIR  : ${data.kasir}
${'-'.repeat(32)}
${tiketMasukStr}
${'-'.repeat(32)}
${formatLine('Sub Total', rupiah(data.totalBayarSebelumDiskon))}
${formatLine('Diskon', rupiah(data.diskon))}
${'-'.repeat(32)}
${formatLine('Total', rupiah(data.totalBayarSetelahDiskon))}
${formatLine('Bayar(Cash)', rupiah(data.tunai))}
${formatLine('Kembali', rupiah(data.tunai - data.totalBayarSetelahDiskon))}
${'-'.repeat(32)}
${centerText('TIKET HANYA BERLAKU HARI INI')}
${centerText('SIMPAN TIKET SEBAGAI TANDA MASUK')}
${centerText('BERENANGLAH DENGAN TERTIB')}
${centerText('TERIMA KASIH ATAS KUNJUNGANNYA')}
${'-'.repeat(32)}
`;
    dom.printContent.textContent = struk;
}

// --- KUOTA HANDLING ---
function updateKuota() { showKuotaModal(); }
function showKuotaModal() {
    const dewasa = parseInt(dom.dewasaInput.value) || 0;
    const anak = parseInt(dom.anakInput.value) || 0;
    const sisaDewasa = kuotaAwalDewasa - dewasa;
    const sisaAnak = kuotaAwalAnak - anak;
    dom.quotaDewasa.textContent = sisaDewasa >= 0 ? sisaDewasa : 0;
    dom.quotaAnak.textContent = sisaAnak >= 0 ? sisaAnak : 0;
    let pesan = '';
    inputBermasalah = null;
    if ((kuotaAwalDewasa === 0 && dewasa > 0) || sisaDewasa < 0) {
        pesan += 'Kuota dewasa habis.<br>';
        inputBermasalah = dom.dewasaInput;
        const rowDewasa = document.getElementById('rowDewasa');
        if (rowDewasa) rowDewasa.remove();
    }
    if ((kuotaAwalAnak === 0 && anak > 0) || sisaAnak < 0) {
        pesan += 'Kuota anak habis.<br>';
        inputBermasalah = dom.anakInput;
        const rowAnak = document.getElementById('rowAnak');
        if (rowAnak) rowAnak.remove();
    }
    if (pesan !== '') {
        dom.modalKuotaBody.innerHTML = `<p class="mb-0">${pesan}</p><p class="text-muted mt-2"><small>Hubungi administrator.</small></p>`;
        dom.kuotaModal.removeEventListener('shown.bs.modal', modalFocusHandler);
        dom.kuotaModal.addEventListener('shown.bs.modal', modalFocusHandler, { once: true });
        if (!modalInstance) modalInstance = new bootstrap.Modal(dom.kuotaModal, { keyboard: true });
        modalInstance.show();
    }
}
function modalFocusHandler() { dom.btnTutup.focus(); }

// --- RESET & REFRESH ---
function resetInput() {
    dom.namaPemesanInput.focus();
    dom.dewasaInput.value = 0;
    dom.anakInput.value = 0;
    dom.subTotalElement.innerHTML = '';
    dom.modalKembaliElement.innerHTML = '';
    dom.detailTable.innerHTML = '';
    dom.totalBayarElement.innerHTML = '';
    dom.kodeBookingInput.value = '';
    dom.kodeTrxIDInput.value = '';
    dom.discountEl.innerHTML = '';
    dom.totalEl.innerHTML = '';
    dom.inputModalCash.value = '';
    dom.modalTotalElement.innerHTML = '';
    dom.bayarTunaiElement.innerHTML = 'Bayar Rp. 0';
}
async function refreshKodeBooking() {
    try {
        const res1 = await fetch("/transaksi-id");
        const data1 = await res1.json();
        dom.kodeBookingInput.value = data1.kode_booking;
        dom.kodeTrxIDInput.value = data1.transaksi_id;

        const res2 = await fetch('api/capacities');
        const data2 = await res2.json();
        kuotaAwalDewasa = data2.max_dewasa;
        kuotaAwalAnak = data2.max_anak;
        dom.quotaDewasa.textContent = kuotaAwalDewasa;
        dom.quotaAnak.textContent = kuotaAwalAnak;
        dom.dewasaInput.addEventListener('input', updateKuota);
        dom.anakInput.addEventListener('input', updateKuota);
    } catch (error) {
        console.error('Error refreshing kode booking or capacities:', error);
    }
}

// --- KEMBALIAN HANDLING ---
function hitungKembalian() {
    let totalX = parseInt(dom.totalEl.textContent.replace(/\D/g, "")) || 0;
    let tunaiX = parseInt(dom.inputModalCash.value.replace(/\D/g, "")) || 0;
    if (tunaiX === 0) {
        dom.modalKembaliElement.textContent = '';
        dom.modalKembaliElement.classList.remove('kedipKem');
    } else if (tunaiX < totalX) {
        dom.modalKembaliElement.textContent = 'Nominal kurang';
        dom.modalKembaliElement.style.color = '#FF4C4C';
        dom.modalKembaliElement.classList.remove('kedipKem');
    } else {
        let kembalian = tunaiX - totalX;
        dom.modalKembaliElement.textContent = `Rp. ${kembalian.toLocaleString('id-ID')}`;
        dom.modalKembaliElement.style.color = '#000';
        dom.modalKembaliElement.classList.remove('kedipKem');
        if (kembalian > 0) {
            void dom.modalKembaliElement.offsetWidth;
            dom.modalKembaliElement.classList.add('kedipKem');
        }
    }
}

// --- EVENT BINDINGS ---
function bindEvents() {
    dom.dewasaInput.addEventListener('keydown', validateInput);
    dom.dewasaInput.addEventListener('input', updateTotalBayar);
    dom.anakInput.addEventListener('keydown', validateInput);
    dom.anakInput.addEventListener('input', updateTotalBayar);

    dom.btnErrClose.addEventListener('click', () => {
        dom.namaPemesanInput.focus();
        dom.btnErrClose.classList.remove('focus-button');
    });

    dom.inputModalCash.addEventListener('input', () => {
        hitungKembalian();
    });

    dom.modalKonfirmasiBayarEl.addEventListener('hidden.bs.modal', () => {
        dom.namaPemesanInput.focus();
    });

    dom.namaPemesanInput.addEventListener('keydown', e => handleEnterKey(e, dom.dewasaInput));
    dom.namaPemesanInput.addEventListener('keydown', e => handleArrowRight(e, dom.dewasaInput));
    dom.namaPemesanInput.addEventListener('keydown', e => handleArrowDownKey(e, dom.dewasaInput));
    dom.dewasaInput.addEventListener('keydown', e => handleEnterKey(e, dom.anakInput));
    dom.dewasaInput.addEventListener('keydown', e => handleArrowDownKey(e, dom.anakInput));
    dom.dewasaInput.addEventListener('keydown', e => handleArrowUpKey(e, dom.namaPemesanInput));
    dom.dewasaInput.addEventListener('keydown', e => handleArrowKey(e, dom.namaPemesanInput, dom.anakInput));
    dom.anakInput.addEventListener('keydown', e => handleEnterKey(e, dom.bayarTunaiElement));
    dom.anakInput.addEventListener('keydown', e => handleArrowDownKey(e, dom.bayarTunaiElement));
    dom.anakInput.addEventListener('keydown', e => handleArrowKey(e, dom.dewasaInput, dom.bayarTunaiElement));
    dom.anakInput.addEventListener('keydown', e => handleArrowUpKey(e, dom.dewasaInput));
    dom.bayarTunaiElement.addEventListener('keydown', e => handleArrowUpKey(e, dom.anakInput));
    dom.inputModalCash.addEventListener('keydown', e => handleEnterKey(e, dom.btnKonfirmasiEl));
    dom.inputModalCash.addEventListener('keydown', e => handleArrowDownKey(e, dom.btnKonfirmasiEl));
    dom.btnKonfirmasiEl.addEventListener('keydown', e => handleArrowUpKey(e, dom.inputModalCash));
    dom.btnKonfirmasiEl.addEventListener('keydown', e => handleArrowKey(e, dom.btnBatalEl, dom.btnKonfirmasiEl));
    dom.btnCetakEl.addEventListener('keydown', e => handleArrowRight(e, dom.btnBatalCetakEl));
    dom.btnBatalCetakEl.addEventListener('keydown', e => handleArrowLeft(e, dom.btnCetakEl));
    dom.btnBatalEl.addEventListener('keydown', e => handleArrowKey(e, dom.btnBatalEl, dom.btnKonfirmasiEl));
    dom.btnBatalEl.addEventListener('keydown', e => handleArrowUpKey(e, dom.inputModalCash));

    dom.dewasaInput.addEventListener('focus', function() { this.select(); });
    dom.anakInput.addEventListener('focus', function() { this.select(); });

    // Modal focus handlers
    dom.modalKonfirmasiBayarEl.addEventListener('shown.bs.modal', () => dom.inputModalCash.focus());
    dom.modalKosong.addEventListener('shown.bs.modal', () => dom.closeModalKosong.focus());
    dom.kuotaModal.addEventListener('hidden.bs.modal', () => {
        if (inputBermasalah) {
            inputBermasalah.value = 0;
            inputBermasalah.focus();
            updateTotalBayar();
        }
    });

    // Input restrictions
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener("input", function () {
            if (this.id === "dewasa" || this.id === "anak") {
                if (this.value.length > 3) this.value = this.value.slice(0, 3);
            }
            if (this.id === "modalCash") {
                let numericValue = this.value.replace(/[^0-9]/g, '');
                if (numericValue.length > 8) numericValue = numericValue.slice(0, 8);
                this.value = formatRupiah(numericValue);
            }
        });
    });

    // Bayar tunai enter
    dom.bayarTunaiElement.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            hitungKembalian();
            let namaPemesan = dom.namaPemesanInput.value.trim();
            let dewasa = parseInt(dom.dewasaInput.value) || 0;
            let anak = parseInt(dom.anakInput.value) || 0;
            let subTotal = dom.subTotalElement?.textContent.trim();
            let totalBayarCash = dom.totalEl?.textContent.trim();
            if (!namaPemesan || dewasa === "" || anak === "" || subTotal === "" || Number(subTotal) === 0 || !totalBayarCash) {
                const modalKosongInstance = new bootstrap.Modal(dom.modalKosong);
                modalKosongInstance.show();
                dom.modalKosong.addEventListener('shown.bs.modal', function() {
                    dom.closeModalKosong.focus();
                    dom.closeModalKosong.addEventListener('click', () => dom.namaPemesanInput.focus(), { once: true });
                }, { once: true });
                dom.modalKosong.addEventListener('hidden.bs.modal', () => dom.namaPemesanInput.focus(), { once: true });
                return;
            }
            const totalText = dom.totalEl.textContent.replace(/[^\d]/g, "");
            const totalValue = parseInt(totalText || 0);
            dom.modalTotalElement.textContent = "Rp. " + totalValue.toLocaleString('id-ID');
            dom.modalTotalElement.classList.remove('kedip');
            void dom.modalTotalElement.offsetWidth;
            dom.modalTotalElement.classList.add('kedip');
            dom.inputModalCash.value = "";
            dom.modalKembaliElement.textContent = "";
            const modalBayar = new bootstrap.Modal(dom.modalKonfirmasiBayarEl, { keyboard: true });
            modalBayar.show();
        }
    });

    // Konfirmasi pembayaran
    dom.btnKonfirmasiEl.addEventListener("click", async function(e) {
        e.preventDefault();
        const angkaCash = dom.inputModalCash.value.trim().replace(/[^\d]/g, "");
        if (angkaCash === "" || parseInt(angkaCash, 10) === 0) {
            alert("Mohon masukkan jumlah uang tunai terlebih dahulu.");
            dom.inputModalCash.focus();
            return;
        }
        const nilaiCash = parseInt(angkaCash, 10);
        const nilaiTotal = parseInt(dom.modalTotalElement.textContent.replace(/[^\d]/g, ""), 10);
        if (nilaiCash < nilaiTotal) {
            alert("Jumlah uang tunai kurang dari total bayar.");
            dom.inputModalCash.focus();
            return;
        }
        const data = {
            kodeBooking: dom.kodeBookingInput.value,
            transaksiId: dom.kodeTrxIDInput.value,
            kasir: dom.namaKasir.value,
            namaPemesan: dom.namaPemesanInput.value,
            dewasa: parseInt(dom.dewasaInput.value),
            anak: parseInt(dom.anakInput.value),
            tunai: parseFloat(dom.inputModalCash.value.replace(/[^\d]/g, '')),
        };
        try {
            const response = await fetch('/booking-offline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const res = await response.json();
            if (res.error) {
                alert('Gagal: ' + res.error);
                return;
            }
            bootstrap.Modal.getInstance(dom.modalKonfirmasiBayarEl).hide();
            tampilkanStruk({
                ...data,
                harga1: res.harga1,
                harga2: res.harga2,
                metodePembayaran: res.metodePembayaran,
                totalBayarSebelumDiskon: res.total_sbl_diskon,
                diskon: res.diskon,
                totalBayarSetelahDiskon: res.total_stl_diskon,
                tanggal: new Date().toLocaleDateString('id-ID'),
                waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'}),
            });
            resetInput();
            await refreshKodeBooking();
            let previewModalInstance = bootstrap.Modal.getInstance(dom.previewModalEl);
            if (!previewModalInstance) previewModalInstance = new bootstrap.Modal(dom.previewModalEl, { keyboard: true });
            previewModalInstance.show();
            dom.btnCetakEl.addEventListener('click', function () {
                dom.printSection.textContent = dom.printContent.textContent;
                dom.printSection.style.display = 'block';
                setTimeout(() => window.print(), 200);
                window.onafterprint = () => {
                    requestAnimationFrame(() => {
                        dom.printSection.style.display = 'none';
                        dom.printSection.textContent = '';
                        let modalInstance = bootstrap.Modal.getInstance(dom.previewModalEl);
                        if (modalInstance) modalInstance.hide();
                        dom.namaPemesanInput.focus();
                    });
                };
            });
            dom.btnBatalCetakEl.addEventListener('click', function() {
                dom.previewModalEl.addEventListener('hidden.bs.modal', () => dom.namaPemesanInput.focus(), { once: true });
                let modalInstancePrintView = bootstrap.Modal.getInstance(dom.previewModalEl);
                if (modalInstancePrintView) modalInstancePrintView.hide();
            });
        } catch (error) {
            alert('Terjadi kesalahan saat menyimpan booking.');
            console.error(error);
        }
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    cacheDom();
    await refreshKodeBooking();
    dom.dewasaInput.value = '0';
    dom.anakInput.value = '0';
    try {
        const res = await fetch('/transaksi-id');
        const data = await res.json();
        dom.kodeBookingInput.value = data.kode_booking;
        dom.kodeTrxIDInput.value = data.transaksi_id;
    } catch (e) {
        console.error('Error fetching transaksi-id:', e);
    }
    try {
        const res = await fetch('/username');
        const data = await res.json();
        dom.namaPemesanInput.value = data.fullname || "";
    } catch (e) {
        console.error('Error fetching username:', e);
    }
    try {
        const res = await fetch('/price');
        const data = await res.json();
        document.getElementById('hargaDewasa').textContent = `${parseFloat(data.harga_dewasa).toLocaleString('id-ID')}`;
        document.getElementById('hargaAnak').textContent = `${parseFloat(data.harga_anak).toLocaleString('id-ID')}`;
    } catch (e) {
        console.error('Error fetching price:', e);
    }
    bindEvents();
    setTimeout(() => {
        dom.namaPemesanInput.focus();
        dom.namaPemesanInput.select();
    }, 200);
});