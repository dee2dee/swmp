package models

import "time"

type Price struct {
	ID          uint    `json:"id" gorm:"primaryKey"`
	HargaDewasa float64 `json:"harga_dewasa"`
	HargaAnak   float64 `json:"harga_anak"`
}

type Capacities struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	MaxDewasa float64 `json:"max_dewasa"`
	MaxAnak   float64 `json:"max_anak"`
}
type User struct {
	ID       string `json:"id" gorm:"primaryKey;autoIncrement"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type Operator struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Username string `json:"username"`
	Password string `json:"password"`
	Fullname string `json:"fullname"`
	Role     string `json:"role"`
}

type Authlogin struct {
	ID       string `json:"id" gorm:"primaryKey;autoIncrement"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type BookingRequest struct {
	KodeBooking      string  `json:"kodeBooking"`
	QRCode           string  `json:"qrCode"`
	TglPemesananStr  string  `json:"tglPemesananStr"`
	TglKadaluarsaStr string  `json:"tglKadaluarsaStr"`
	NamaPemesan      string  `json:"namaPemesan"`
	Dewasa           uint    `json:"dewasa"`
	Harga1           float64 `json:"hargaDewasa"`
	Anak             uint    `json:"anak"`
	Harga2           float64 `json:"hargaAnak"`
	JmlPengunjung    uint    `json:"jmlPengunjung"`
	MetodePembayaran string  `json:"metodePembayaran"`
	TotalBayar       float64 `json:"totalBayar"`
}

type Bookings struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	KodeBooking      string    `json:"kode_booking" gorm:"uniqueIndex"`
	TransaksiId      string    `json:"transaksi_id"`
	QRCode           string    `json:"qr_code"`
	TglPemesanan     time.Time `json:"tgl_pemesanan"`
	ExpiredAt        time.Time `json:"expired_at"`
	NamaPemesan      string    `json:"nama_pemesan"`
	Dewasa           uint      `json:"dewasa"`
	Harga1           float64   `json:"harga1"`
	Anak             uint      `json:"anak"`
	Harga2           float64   `json:"harga2"`
	JmlPengunjung    uint      `json:"jml_pengunjung"`
	MetodePembayaran string    `json:"metode_pembayaran"`
	TotalBayar       float64   `json:"total_bayar"`
	Diskon           float64   `json:"diskon"`
	TotalBayar2      float64   `json:"total_bayar2"`
	Tunai            float64   `json:"tunai"`
	PaymentStatus    string    `json:"payment_status"`
	BookingStatus    string    `json:"booking_status"`
}

type Invoices struct {
	ID        uint   `gorm:"primaryKey"`
	NoInvoice string `gorm:"unique"`
	Status    string `gorm:"default:pending"`
	CreatedAt time.Time
}

type Reservations struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	KodeBooking      string    `json:"kode_booking" gorm:"uniqueIndex"`
	TransaksiId      string    `json:"transaksi_id"`
	QRCode           string    `json:"qr_code"`
	NoInvoice        string    `json:"no_invoice"`
	TglInvoice       time.Time `json:"tgl_invoice"`
	TglPemesanan     time.Time `json:"tgl_pemesanan"`
	NamaPemesan      string    `json:"nama_pemesan"`
	NoTelepon        string    `json:"no_telepon"`
	TglKunjungan     string    `json:"tgl_kunjungan"`
	TglExpired       time.Time `json:"tgl_expired"`
	Dewasa           uint      `json:"dewasa"`
	Harga1           float64   `json:"harga1"`
	Anak             uint      `json:"anak"`
	Harga2           float64   `json:"harga2"`
	JmlPengunjung    uint      `json:"jml_pengunjung"`
	MetodePembayaran string    `json:"metode_pembayaran"`
	TotalBayar       float64   `json:"total_bayar"`
	TglJatuhTempo    time.Time `json:"tgl_jatuh_tempo"`
	PaymentStatus    string    `json:"payment_status"`
	BookingStatus    string    `json:"booking_status"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Checkins struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	KodeBooking      string    `json:"kode_booking" gorm:"uniqueIndex"`
	TransaksiId      string    `json:"transaksi_id"`
	QRCode           string    `json:"qr_code"`
	TglPemesananStr  string    `json:"tgl_pemesanan_str"`
	CheckinAt        time.Time `json:"checkin_at"`
	Kasir            string    `json:"kasir"`
	NamaPemesan      string    `json:"nama_pemesan"`
	Dewasa           uint      `json:"dewasa"`
	Harga1           float64   `json:"harga1"`
	Anak             uint      `json:"anak"`
	Harga2           float64   `json:"harga2"`
	JmlPengunjung    uint      `json:"jml_pengunjung"`
	MetodePembayaran string    `json:"metode_pembayaran"`
	TotalBayar       float64   `json:"total_bayar"`
	Tunai            float64   `json:"tunai"`
	PaymentStatus    string    `json:"payment_status"`
	CheckinStatus    string    `json:"checkin_status"`
	Diskon           float64   `json:"diskon"`
	TotalBayar2      float64   `json:"total_bayar2"`
}

type Discount struct {
	ID            uint    `json:"id" gorm:"primaryKey"`
	NamaDiskon    string  `json:"nama_diskon"`
	KategoriTiket string  `json:"kategori_tiket"`
	Diskon        float64 `json:"diskon"`
	MulaiTanggal  string  `json:"mulai_tanggal"`
	AkhirTanggal  string  `json:"akhir_tanggal"`
	Deskripsi     string  `json:"deskripsi"`
}

type DashboardData struct {
	TotalPenjualanHariIni   float64
	TotalPengunjungBulanIni float64
	TotalPendapatan         float64
	TotalPengunjungHariIni  float64
}
