# SWMP — Swimming Pool Ticket Management Platform

**SWMP (Swimming Pool Management Platform)** 
adalah aplikasi web untuk mengelola **pemesanan tiket kolam renang** secara **offline dan online**.
Dibangun menggunakan **Golang (Gin Framework)** dengan arsitektur **MVC (Model–View–Controller)**,sistem **autentikasi berbasis session**, dan **multi-role dashboard** (Admin & Operator).

---

## Fitur Utama

### Pemesanan & Manajemen Tiket
- Pemesanan tiket **offline** & **online**
- Perhitungan otomatis total pembayaran (dewasa / anak-anak)
- Kode booking & nomor invoice unik per transaksi
- Validasi dan **check-in pengunjung** menggunakan kode booking

### Multi Role User
- **Admin Dashboard**  
  Mengatur harga tiket, memantau laporan transaksi & pengunjung
- **Operator Dashboard**  
  Melakukan check-in pengunjung, membuat transaksi offline, melihat data kapasitas kolam

### Fitur Tambahan
- Sistem login menggunakan **session cookie**
- Middleware **AuthLoginRequired** untuk proteksi halaman sensitif
- Rendering halaman menggunakan **Go HTML Template**
- Tampilan responsif menggunakan **Bootstrap 5**
- Middleware cache-control agar halaman lebih aman

---

## Struktur Folder Proyek

swmp/  
├── controllers/ # Logika utama endpoint (Auth, Dashboard, Booking, dsb)  
├── middlewares/ # Middleware (AuthLoginRequired, NoCache, Session setup)  
├── models/      # Model dan koneksi database (MySQL)  
├── routers/     # Routing utama dan registrasi endpoint  
├── static/      # File statis (CSS, JS, Gambar)  
├── templates/   # Template HTML utama (base, layout, dashboard)  
├── views/       # Konten halaman (beranda, tiket, laporan, setting, dsb)  
├── main.go      # Entry point aplikasi  
├── go.mod       # Daftar dependensi  
├── go.sum       # Checksum dependensi  
└── .idea/       # Konfigurasi IDE (JetBrains / Goland)  


---

## Endpoint API & Web Routes

### Autentikasi & Session
| Method   | Endpoint     | Deskripsi                         |
|----------|--------------|-----------------------------------|
| `GET`    | `/auth/login`| Halaman login                     |
| `POST`   | `/auth/login`| Proses login                      |
| `DELETE` | `/logout`    | Logout dan hapus session          |
| `GET`    | `/username`  | Ambil username aktif dari session |

### Tiket & Reservasi
| Method | Endpoint                | Deskripsi                            |
|--------|-------------------------|--------------------------------------|
| `GET`  | `/ticket-offline`       | Pemesanan tiket offline              |
| `GET`  | `/ticket-online`        | Pemesanan tiket online               |
| `POST` | `/booking-offline`      | Simpan transaksi tiket offline       |
| `POST` | `/reservation`          | Simpan transaksi tiket online        |
| `GET`  | `/booking/:kodeBooking` | Dapatkan data tiket berdasarkan kode |
| `POST` | `/checkin/:kode`        | Check-in pengunjung                  |

### Pembayaran & Harga
| Method | Endpoint       | Deskripsi                   |
|--------|----------------|-----------------------------|
| `POST` | `/total-bayar` | Hitung total pembayaran     |
| `GET`  | `/price`       | Ambil daftar harga tiket    |
| `GET`  | `/invoice`     | Ambil nomor invoice terbaru |

### 📊 Laporan & Dashboard
| Method | Endpoint                   | Deskripsi          |
|--------|----------------------------|--------------------|
| `GET`  | `/auth/dashboard/admin`    | Dashboard Admin    |
| `GET`  | `/auth/dashboard/operator` | Dashboard Operator |
| `GET`  | `/auth/dashboard`          | Dashboard umum     |
| `GET`  | `/auth/transaction-report` | Laporan transaksi  |
| `GET`  | `/auth/visitor-report`     | Laporan pengunjung |
| `GET`  | `/auth/setting`            | Pengaturan sistem  |

---

## Teknologi yang Digunakan

| Komponen               | Teknologi                            |
|------------------------|--------------------------------------|
| **Backend**            | Go (Golang)                          |
| **Framework**          | Gin Gonic                            |
| **Template Engine**    | Go `html/template`                   |
| **Frontend UI**        | Bootstrap 5                          |
| **Session Management** | gin-contrib/sessions                 |
| **Database**           | MySQL                                |
| **Auth**               | Cookie-based Session                 |
| **Rendering**          | Go Templates dengan layout base.html |

---

## Cara Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone https://github.com/username/swmp.git
cd swmp

2. Install Dependensi
go mod tidy

3. Jalankan Server
go run main.go

4. Akses di Browser
http://localhost:8080

```

**Tentang Developer**  
Saya adalah seorang Backend Developer pemula yang sedang mengembangkan sistem manajemen tiket berbasis Golang dan Gin Framework.
Proyek ini dibuat untuk mempelajari:
-Autentikasi berbasis session
-Struktur MVC pada aplikasi Go
-Implementasi template rendering HTML
-Middleware dan route protection

**Design**
UI/UX : https://solusimobile.netlify.app/portfolio  
  
Status: Dalam pengembangan  
Kontak: dedeeapr17@gmail.com  
GitHub: https://github.com/dee2dee/swmp  
*Terbuka untuk kolaborasi dalam pengembangan.  
  
---

**Lisensi**  
Proyek ini dibuat untuk tujuan pembelajaran dan pengembangan pribadi.  
Bebas digunakan dan dimodifikasi dengan mencantumkan atribusi yang sesuai.  
