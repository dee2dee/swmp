package controllers

import (
	"encoding/base64"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"swmpool/models"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm/clause"
)

func CheckPassword(hashedPassword, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}

func GetDashboardAdmin(c *gin.Context) {
	session := sessions.Default(c)
	authUsername := session.Get("auth_login") // Ambil username dari sesi
	authRole := session.Get("auth_role")      // Ambil role dari sesi

	if authUsername == nil {
		c.Redirect(http.StatusFound, "/auth/login")
		return
	}

	// Kirim data ke template
	c.HTML(http.StatusOK, "Admin", gin.H{
		"title":    "Admin",
		"username": authUsername, // Kirim username ke template
		"role":     authRole,     // Kirim role ke template
	})
}

func GetDashboardOverview(c *gin.Context) {
	session := sessions.Default(c)
	authUsername := session.Get("auth_login") // Ambil username dari sesi
	authRole := session.Get("auth_role")      // Ambil role dari sesi

	if authUsername == nil {
		c.Redirect(http.StatusFound, "/auth/login")
		return
	}

	// Kirim data ke template
	c.HTML(http.StatusOK, "Dashboard Overview", gin.H{
		"title":    "Dashboard Overview",
		"username": authUsername, // Kirim username ke template
		"role":     authRole,     // Kirim role ke template
	})
}

func GetManagemenTicket(c *gin.Context) {
	session := sessions.Default(c)
	authUsername := session.Get("auth_login") // Ambil username dari sesi
	authRole := session.Get("auth_role")      // Ambil role dari sesi

	if authUsername == nil {
		c.Redirect(http.StatusFound, "/auth/login")
		return
	}

	// Kirim data ke template
	c.HTML(http.StatusOK, "Managemen Ticket", gin.H{
		"title":    "Managemen Ticket",
		"username": authUsername, // Kirim username ke template
		"role":     authRole,     // Kirim role ke template
	})

}

func GetVisitorReport(c *gin.Context) {
	session := sessions.Default(c)
	authUsername := session.Get("auth_login") // Ambil username dari sesi
	authRole := session.Get("auth_role")      // Ambil role dari sesi

	if authUsername == nil {
		c.Redirect(http.StatusFound, "/auth/login")
		return
	}

	// Kirim data ke template
	c.HTML(http.StatusOK, "Visitor Report", gin.H{
		"title":    "Visitor Report",
		"username": authUsername, // Kirim username ke template
		"role":     authRole,     // Kirim role ke template
	})
}

func GetSetting(c *gin.Context) {
	session := sessions.Default(c)
	authUsername := session.Get("auth_login") // Ambil username dari sesi
	authRole := session.Get("auth_role")      // Ambil role dari sesi

	if authUsername == nil {
		c.Redirect(http.StatusFound, "/auth/login")
		return
	}

	// Kirim data ke template
	c.HTML(http.StatusOK, "Setting", gin.H{
		"title":    "Setting",
		"username": authUsername, // Kirim username ke template
		"role":     authRole,     // Kirim role ke template
	})

}

func GetDashboardOperator(c *gin.Context) {
	session := sessions.Default(c)
	authUsername := session.Get("auth_login") // Ambil username dari sesi

	if authUsername == nil {
		c.Redirect(http.StatusFound, "/auth/login")
		return
	}

	// Kirim data ke template
	c.HTML(http.StatusOK, "Operator", gin.H{
		"title":    "Operator",
		"username": authUsername, // Kirim username ke template
	})
}

func GetTransactionReport(c *gin.Context) {
	session := sessions.Default(c)
	authUsername := session.Get("auth_login") // Ambil username dari sesi
	authRole := session.Get("auth_role")      // Ambil role dari sesi

	if authUsername == nil {
		c.Redirect(http.StatusFound, "/auth/login")
		return
	}

	// Kirim data ke template
	c.HTML(http.StatusOK, "Transaction Report", gin.H{
		"title":    "Transaction Report",
		"username": authUsername, // Kirim username ke template
		"role":     authRole,     // Kirim role ke template
	})

}

func Login(c *gin.Context) {
	var input models.Operator
	var storedUser models.Operator

	// Bind input dari request JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validasi input kosong
	if input.Username == "" || input.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username and password cannot be empty"})
		return
	}

	// Cek username di database
	if err := models.DB.Where("username = ?", input.Username).First(&storedUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// Cek password
	if !CheckPassword(storedUser.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// Simpan sesi login
	session := sessions.Default(c)
	session.Set("auth_login", storedUser.Username) // Simpan username ke session
	session.Set("auth_role", storedUser.Role)      // Simpan role ke session
	fmt.Printf("Session Username: %v, Role: %v\n", storedUser.Username, storedUser.Role)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}

	// Redirect berdasarkan role pengguna
	var redirectURL string
	switch storedUser.Role {
	case "admin":
		redirectURL = "/auth/dashboard/admin"
	case "operator":
		redirectURL = "/auth/dashboard/operator"
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "User role not recognized"})
		return
	}

	// Response login sukses
	c.JSON(http.StatusOK, gin.H{
		"message":  "Login successful.",
		"redirect": redirectURL,
		"username": storedUser.Username,
		"role":     storedUser.Role,
	})
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)

	// Ambil informasi username dari sesi
	authUsername := session.Get("auth_login")

	// Jika pengguna belum login, arahkan ke halaman login
	if authUsername == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not logged in"})
		return
	}

	// Hapus semua data session
	session.Clear()
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear session"})
		return
	}

	// Hapus cookie terkait session
	c.SetCookie("sessionStore", "", -1, "/", "", false, true)

	// Logout sukses
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func GetTicketOnline(c *gin.Context) {
	c.HTML(http.StatusOK, "Ticket Online", gin.H{
		"title": "Ticket Online",
	})
}

func GetTicketOffline(c *gin.Context) {
	var price models.Price

	// Ambil data harga dari database
	if err := models.DB.First(&price).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch price data"})
		return
	}

	// Ambil data session operator
	session := sessions.Default(c)
	username := session.Get("auth_login")
	if username == nil {
		c.Redirect(http.StatusFound, "/auth/login")
		return
	}

	var operator models.Operator
	if err := models.DB.Where("username = ?", username).First(&operator).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch operator data"})
		return
	}

	// Render form pemesanan tiket dengan harga
	c.HTML(http.StatusOK, "Ticket Offline", gin.H{
		"title":        "Ticket Offline",
		"harga_dewasa": price.HargaDewasa,
		"harga_anak":   price.HargaAnak,
		"fullname":     operator.Fullname,
	})
}

func GetTicketReservation(c *gin.Context) {
	var price models.Price

	// Ambil data harga dari database
	if err := models.DB.First(&price).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch price data"})
		return
	}

	// Render form pemesanan tiket dengan harga
	c.HTML(http.StatusOK, "Ticket Reservation", gin.H{
		"title":        "Ticket Reservation",
		"harga_dewasa": price.HargaDewasa,
		"harga_anak":   price.HargaAnak,
	})
}

// Generate kode booking
func GenerateBookingCode() string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var seededRand = rand.New(rand.NewSource(time.Now().UnixNano()))

	b := make([]byte, 8)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

// Generate QR Kode
func GenerateQRCode(kodeBooking string) (string, error) {
	qrCode, err := qrcode.Encode(kodeBooking, qrcode.Medium, 256)
	if err != nil {
		return "", err
	}

	base64QR := base64.StdEncoding.EncodeToString(qrCode)

	return base64QR, nil
}

func GetCodeBooking(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("auth_login") // Ambil username dari sesi

	if username == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authentication"})
		return
	}

	kode := c.Param("kodeBooking")

	var (
		booking     models.Bookings
		reservation models.Reservations
		operator    models.Operator
		source      string
	)

	// Coba ambil dari bookings
	fmt.Println("Cek bookings...")
	errBooking := models.DB.Where("kode_booking = ?", kode).First(&booking).Error

	// Coba ambil dari reservations jika booking tidak ditemukan
	fmt.Println("Cek reservations...")
	errReservation := models.DB.Where("kode_booking = ?", kode).First(&reservation).Error

	if errBooking == nil {
		source = "bookings"
	} else if errReservation == nil {
		source = "reservations"
	} else {
		c.JSON(http.StatusNotFound, gin.H{"message": "Kode Booking tidak ditemukan!"})
		return
	}

	// Ambil data lengkap operator
	if err := models.DB.Where("username = ?", username).First(&operator).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	if source == "bookings" {
		if booking.PaymentStatus != "Sudah dibayar" {
			c.JSON(http.StatusForbidden, gin.H{
				"message":        "Pembayaran belum diterima. Silakan selesaikan pembayaran terlebih dahulu.",
				"kode_tiket":     booking.KodeBooking,
				"payment_status": booking.PaymentStatus,
			})
			return
		}

		if booking.BookingStatus != "Belum digunakan" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "Tiket tidak berlaku untuk check-in (status tidak aktif).",
			})
			return
		}
	} else if source == "reservations" {
		if reservation.PaymentStatus != "Sudah dibayar" {
			c.JSON(http.StatusForbidden, gin.H{
				"message":        "Pembayaran belum diterima. Silakan selesaikan pembayaran terlebih dahulu.",
				"kode_tiket":     reservation.KodeBooking,
				"payment_status": reservation.PaymentStatus,
			})
			return
		}

		if reservation.BookingStatus != "Belum digunakan" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "Tiket tidak berlaku untuk check-in (status tidak aktif).",
			})
			return
		}
	}

	// tglBooking := booking.TglPemesanan
	var tglBooking time.Time

	if source == "bookings" {
		tglBooking = booking.TglPemesanan
	} else if source == "reservations" {
		tglBooking = reservation.TglPemesanan
	}

	now := time.Now()

	log.Printf("DEBUG: TglPemesanan=%s | Now=%s", tglBooking.Format("2006-01-02"), now.Format("2006-01-02"))

	// Cek apakah hari ini sama dengan tanggal pemesanan
	sameDay := now.Format("2006-01-02") == tglBooking.Format("2006-01-02")
	jam := now.Hour()

	fmt.Println("TglPemesanan di DB BKG:", booking.TglPemesanan.Format("2006-01-02 15:04:05"))
	fmt.Println("TglPemesanan di DB RSV:", reservation.TglPemesanan.Format("2006-01-02 15:04:05"))
	fmt.Println("Waktu sekarang:", time.Now().Format("2006-01-02 15:04:05"))

	if !sameDay {
		if source == "bookings" {
			if booking.BookingStatus != "Kadaluarsa" {
				models.DB.Model(&booking).Update("booking_status", "Kadaluarsa")
			}
			c.JSON(http.StatusForbidden, gin.H{
				"message":        "Tiket sudah kadaluarsa. Check-In hanya berlaku di tanggal pemesanan yang sama.",
				"kode_tiket":     booking.KodeBooking,
				"tgl_pesan":      booking.TglPemesanan.Format("2006-01-02 15:04:05"),
				"nama_pemesan":   booking.NamaPemesan,
				"booking_status": "Kadaluarsa",
			})
			return
		} else if source == "reservations" {
			if reservation.BookingStatus != "Kadaluarsa" {
				models.DB.Model(&reservation).Update("booking_status", "Kadaluarsa")
			}
			c.JSON(http.StatusForbidden, gin.H{
				"message":        "Tiket sudah kadaluarsa. Check-In hanya berlaku di tanggal kunjungan yang sama.",
				"kode_booking":   reservation.KodeBooking,
				"tgl_pemesanan":  reservation.TglPemesanan.Format("2006-01-02 15:04:05"),
				"nama_pemesan":   reservation.NamaPemesan,
				"booking_status": "Kadaluarsa",
			})
			return
		}
	}

	// Jam < 6 → tidak Kadaluarsa → cuma tolak checkin
	// if jam < 6 {
	// 	c.JSON(http.StatusForbidden, gin.H{
	// 		"message":        "Check-in gagal: Tiket kadaluarsa atau di luar jam operasional (06:00 - 17:00)",
	// 		"kode_tiket":     booking.KodeBooking,
	// 		"tgl_pesan":      booking.TglPemesanan.Format("2006-01-02 15:04:05"),
	// 		"nama_pemesan":   booking.NamaPemesan,
	// 		"booking_status": booking.BookingStatus,
	// 	})
	// 	return
	// }

	// Jam >= 17 → jadi Kadaluarsa
	// if jam >= 17 {
	// 	if booking.BookingStatus != "Kadaluarsa" {
	// 		models.DB.Model(&booking).Update("booking_status", "Kadaluarsa")
	// 	}
	// 	c.JSON(http.StatusForbidden, gin.H{
	// "message":        "Tiket sudah kadaluarsa (melebihi jam operasional).",
	// "kode_tiket":     booking.KodeBooking,
	// "tgl_pesan":      booking.TglPemesanan.Format("2006-01-02 15:04:05"),
	// "nama_pemesan":   booking.NamaPemesan,
	// "booking_status": "Kadaluarsa",
	// 	})
	// 	return
	// }

	if jam >= 17 {
		if source == "bookings" {
			if booking.BookingStatus != "Kadaluarsa" {
				models.DB.Model(&booking).Update("booking_status", "Kadaluarsa")
			}
			c.JSON(http.StatusForbidden, gin.H{
				"message":        "Tiket sudah kadaluarsa (melebihi jam operasional).",
				"kode_tiket":     booking.KodeBooking,
				"tgl_pesan":      booking.TglPemesanan.Format("2006-01-02 15:04:05"),
				"nama_pemesan":   booking.NamaPemesan,
				"booking_status": "Kadaluarsa",
			})
			return
		} else if source == "reservations" {
			if reservation.BookingStatus != "Kadaluarsa" {
				models.DB.Model(&reservation).Update("booking_status", "Kadaluarsa")
			}
			c.JSON(http.StatusForbidden, gin.H{
				"message":        "Tiket sudah kadaluarsa (melebihi jam operasional).",
				"kode_booking":   reservation.KodeBooking,
				"tgl_pemesanan":  reservation.TglPemesanan.Format("2006-01-02 15:04:05"),
				"nama_pemesan":   reservation.NamaPemesan,
				"booking_status": "Kadaluarsa",
			})
			return
		}
	}

	// Sukses kirim ke frontend
	if err := models.DB.Where("kode_booking = ?", kode).First(&booking).Error; err == nil {
		canCheckIn := booking.PaymentStatus == "Sudah dibayar" && booking.BookingStatus == "Belum digunakan"
		c.JSON(http.StatusOK, gin.H{
			"message":        "Check-in berhasil (bookings)",
			"kode_tiket":     booking.KodeBooking,
			"tgl_pesan":      booking.TglPemesanan.Format("2006-01-02 15:04:05"),
			"nama_pemesan":   booking.NamaPemesan,
			"dewasa":         booking.Dewasa,
			"anak":           booking.Anak,
			"jml_pengunjung": booking.JmlPengunjung,
			"metode_pem":     booking.MetodePembayaran,
			"payment_status": booking.PaymentStatus,
			"booking_status": booking.BookingStatus,
			"can_check_in":   canCheckIn,
		})
		return
	}

	if err := models.DB.Where("kode_booking = ?", kode).First(&reservation).Error; err == nil {
		canCheckIn := reservation.PaymentStatus == "Sudah dibayar" && reservation.BookingStatus == "Belum digunakan"
		c.JSON(http.StatusOK, gin.H{
			"message":        "Check-in berhasil (reservations)",
			"kode_tiket":     reservation.KodeBooking,
			"tgl_pesan":      reservation.TglPemesanan.Format("2006-01-02 15:04:05"),
			"nama_pemesan":   reservation.NamaPemesan,
			"dewasa":         reservation.Dewasa,
			"anak":           reservation.Anak,
			"jml_pengunjung": reservation.JmlPengunjung,
			"metode_pem":     reservation.MetodePembayaran,
			"payment_status": reservation.PaymentStatus,
			"booking_status": reservation.BookingStatus,
			"can_check_in":   canCheckIn,
		})
		return
	}

	// Tidak ditemukan di kedua tabel
	c.JSON(http.StatusNotFound, gin.H{
		"message": "Tiket tidak ditemukan di bookings maupun reservations.",
	})
}

func CheckinHandler(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("auth_login") // Ambil username dari sesi

	if username == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authentication"})
		return
	}

	kode := c.Param("kode")

	var (
		booking        models.Bookings
		reservation    models.Reservations
		checkin        models.Checkins
		source         string
		errReservation error
	)

	models.DB = models.DB.Debug() // Tempelkan ini saat init aplikasi

	// Coba ambil dari bookings terlebih dahulu
	fmt.Println("Mencoba mencari kode_booking di tabel bookings...")
	errBooking := models.DB.Where("kode_booking = ?", kode).First(&booking).Error
	fmt.Println("✅ Hasil errBooking:", errBooking)

	if errBooking == nil {
		source = "bookings"
		fmt.Println("✅ Kode ditemukan di tabel bookings.")
	} else {
		// Jika tidak ditemukan di bookings, coba cari di reservations
		fmt.Println("⚠️ Kode tidak ditemukan di bookings. Coba cek di reservations...")

		errReservation = models.DB.Where("kode_booking = ?", kode).First(&reservation).Error
		fmt.Println("✅ Hasil errReservation:", errReservation)

		if errReservation != nil {
			fmt.Println("❌ Kode booking tidak ditemukan di bookings maupun reservations.")
			c.JSON(http.StatusNotFound, gin.H{"message": "Kode Booking tidak ditemukan di bookings maupun reservations."})
			return
		}
		source = "reservations"
		fmt.Println("✅ Kode ditemukan di tabel reservations.")
	}

	// Ambil data operator
	var operator models.Operator
	if err := models.DB.Where("username = ?", username).First(&operator).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Operator tidak ditemukan"})
		return
	}

	// Buat objek checkin berdasarkan sumber data
	if source == "bookings" {
		checkin = models.Checkins{
			KodeBooking:      booking.KodeBooking,
			TransaksiId:      booking.TransaksiId,
			QRCode:           booking.QRCode,
			TglPemesananStr:  booking.TglPemesanan.Format("2006-01-02 15:04:05"),
			CheckinAt:        time.Now(),
			Kasir:            operator.Fullname,
			NamaPemesan:      booking.NamaPemesan,
			Dewasa:           booking.Dewasa,
			Harga1:           booking.Harga1,
			Anak:             booking.Anak,
			Harga2:           booking.Harga2,
			JmlPengunjung:    booking.JmlPengunjung,
			MetodePembayaran: booking.MetodePembayaran,
			TotalBayar:       booking.TotalBayar,
			Diskon:           booking.Diskon,
			TotalBayar2:      booking.TotalBayar2,
			Tunai:            booking.Tunai,
			PaymentStatus:    booking.PaymentStatus,
			CheckinStatus:    "Sudah digunakan",
		}
	} else {
		checkin = models.Checkins{
			KodeBooking:      reservation.KodeBooking,
			TransaksiId:      reservation.TransaksiId,
			QRCode:           reservation.QRCode,
			TglPemesananStr:  reservation.TglPemesanan.Format("2006-01-02 15:04:05"),
			CheckinAt:        time.Now(),
			Kasir:            operator.Fullname,
			NamaPemesan:      reservation.NamaPemesan,
			Dewasa:           reservation.Dewasa,
			Harga1:           reservation.Harga1,
			Anak:             reservation.Anak,
			Harga2:           reservation.Harga2,
			JmlPengunjung:    reservation.JmlPengunjung,
			MetodePembayaran: reservation.MetodePembayaran,
			TotalBayar:       reservation.TotalBayar,
			Diskon:           0,
			TotalBayar2:      reservation.TotalBayar,
			Tunai:            reservation.TotalBayar,
			PaymentStatus:    reservation.PaymentStatus,
			CheckinStatus:    "Sudah digunakan",
		}
	}

	// Mulai transaksi
	tx := models.DB.Begin()

	// Simpan check-in
	if err := tx.Create(&checkin).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal menyimpan data check-in"})
		return
	}

	// Hapus data dari tabel asal
	if source == "bookings" {
		if err := tx.Delete(&booking).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal menghapus data booking"})
			return
		}
	} else {
		if err := tx.Delete(&reservation).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal menghapus data reservation"})
			return
		}
	}

	// Commit transaksi
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal commit transaksi check-in"})
		return
	}

	// Berhasil
	fmt.Println("Check-in berhasil untuk kode:", kode, "dari tabel", source)
	c.JSON(http.StatusOK, gin.H{
		"message": "Check-in berhasil",
	})

}

func ReservationTicket(c *gin.Context) {
	var input struct {
		KodeBooking  string `json:"kodeBooking"`
		TransaksiId  string `json:"transaksiId"`
		NoInvoice    string `json:"noInvoice"`
		NamaPemesan  string `json:"namaPemesan" binding:"required"`
		NoTelepon    string `json:"noTelepon"`
		TglKunjungan string `json:"tglKunjungan"`
		Dewasa       uint   `json:"dewasa"`
		Anak         uint   `json:"anak"`
	}

	// Validasi input dari JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data input tidak valid"})
		return
	}

	// Ambil harga dari tabel price
	var price models.Price
	if err := models.DB.First(&price).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data nilai"})
		return
	}

	// Hitung total bayar dan jumlah pengunjung
	totalBayar := float64(input.Dewasa)*price.HargaDewasa + float64(input.Anak)*price.HargaAnak
	jmlPengunjung := input.Dewasa + input.Anak
	totalHarga1 := float64(input.Dewasa) * price.HargaDewasa
	totalHarga2 := float64(input.Anak) * price.HargaAnak
	subTotal := totalHarga1 + totalHarga2

	// Generate QR Code berdasarkan kode booking
	qrCode, err := GenerateQRCode(input.KodeBooking)
	if err != nil {
		log.Println("Gagal generate QR Code:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat QR Code"})
		return
	}

	// Zona waktu Indonesia
	loc, _ := time.LoadLocation("Asia/Jakarta")

	// Parsing tanggal kunjungan dari string
	tglKunjunganData, err := time.ParseInLocation("2006-01-02", input.TglKunjungan, loc)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format tanggal kunjungan tidak valid. Gunakan format DD-MM-YYYY-MM-DD"})
		return
	}

	// Hitung expired_at (jam 17:00 di hari kunjungan)
	expiredAt := time.Date(
		tglKunjunganData.Year(),
		tglKunjunganData.Month(),
		tglKunjunganData.Day(),
		17, 0, 0, 0,
		loc,
	)

	now := time.Now().In(loc)
	tglInvoice := now
	tglPemesanan := now
	tglCreatedAt := now
	tglUpdateAt := now

	// Mulai transaksi
	tx := models.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memulai transaksi"})
		return
	}

	// Cek apakah no_invoice sudah digunakan lebih dulu
	var existing models.Reservations
	if err := tx.Where("no_invoice = ?", input.NoInvoice).First(&existing).Error; err == nil {
		tx.Rollback()
		c.JSON(http.StatusConflict, gin.H{"error": "Nomor invoice sudah digunakan"})
		return
	}

	// Ambil kapasitas dan kunci baris (FOR UPDATE agar aman dari race condition)
	var kapasitas models.Capacities
	if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&kapasitas).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data kuota"})
		return
	}

	// Validasi kuota
	if float64(input.Dewasa) > kapasitas.MaxDewasa || float64(input.Anak) > kapasitas.MaxAnak {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Kuota tidak cukup"})
		return
	}

	// Kurangi kuota
	kapasitas.MaxDewasa -= float64(input.Dewasa)
	kapasitas.MaxAnak -= float64(input.Anak)

	if err := tx.Save(&kapasitas).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan kapasitas"})
		return
	}

	// Simpan ke database
	reservation := models.Reservations{
		KodeBooking:      input.KodeBooking,
		TransaksiId:      input.TransaksiId,
		QRCode:           qrCode,
		TglPemesanan:     tglPemesanan,
		NamaPemesan:      input.NamaPemesan,
		NoTelepon:        input.NoTelepon,
		TglKunjungan:     tglKunjunganData.Format("02 Jan 2006"),
		TglExpired:       expiredAt,
		Dewasa:           input.Dewasa,
		Harga1:           price.HargaDewasa,
		Anak:             input.Anak,
		Harga2:           price.HargaAnak,
		JmlPengunjung:    jmlPengunjung,
		MetodePembayaran: "null",
		TotalBayar:       totalBayar,
		TglJatuhTempo:    now.Add(1 * time.Hour),
		PaymentStatus:    "Belum dibayar",
		BookingStatus:    "Menunggu",
		NoInvoice:        input.NoInvoice,
		TglInvoice:       tglInvoice,
		CreatedAt:        tglCreatedAt,
		UpdatedAt:        tglUpdateAt,
	}

	if err := tx.Create(&reservation).Error; err != nil {
		log.Println("Error saving data:", err)
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data booking"})
		return
	}

	// Selesai transaksi
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed transaction"})
		return
	}

	// Kirim respons ke frontend
	c.JSON(http.StatusOK, gin.H{
		"message":         "Pemesanan berhasil",
		"kode_booking":    input.KodeBooking,
		"trx_id":          input.TransaksiId,
		"tgl_pemesanan":   tglPemesanan.Format("02 Jan 2006, 15:04"),
		"nama_pemesan":    input.NamaPemesan,
		"tgl_kunjungan":   tglKunjunganData.Format("02 Jan 2006"),
		"tgl_expired":     expiredAt.Format("2006-01-02 15:04:05"),
		"no_telepon":      input.NoTelepon,
		"dewasa":          input.Dewasa,
		"anak":            input.Anak,
		"jml_pengunjung":  jmlPengunjung,
		"total_bayar":     totalBayar,
		"tgl_jatuh_tempo": now.Add(1 * time.Hour),
		"no_invoice":      input.NoInvoice,
		"tgl_invoice":     tglInvoice.Format("2006-01-02 15:04:05"),
		"harga_dewasa":    reservation.Harga1,
		"harga_anak":      reservation.Harga2,
		"total_harga1":    totalHarga1,
		"total_harga2":    totalHarga2,
		"sub_total":       subTotal,
	})
}

// Booking ticket offline
func BookingTicketOffline(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("auth_login") // Ambil username dari sesi

	if username == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authentication"})
		return
	}

	var input struct {
		KodeBooking string  `json:"kodeBooking"`
		TransaksiId string  `json:"transaksiId"`
		Kasir       string  `json:"kasir"`
		NamaPemesan string  `json:"namaPemesan" binding:"required"`
		Dewasa      uint    `json:"dewasa"`
		Anak        uint    `json:"anak"`
		Tunai       float64 `json:"tunai" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data input tidak valid"})
		return
	}

	fmt.Printf("Capacity: %+v\n", input)

	// Lakukan pengecekan khusus untuk input tunai
	if input.Tunai <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tunai harus lebih dari 0"})
		return
	}

	// Ambil harga tiket
	var price models.Price
	if err := models.DB.First(&price).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data harga"})
		return
	}

	// Ambil diskon yang belaku untuk anak-anak
	var diskon models.Discount
	if err := models.DB.Where("kategori_tiket = ? AND CURRENT_DATE BETWEEN mulai_tanggal AND akhir_tanggal", "Anak").First(&diskon).Error; err != nil {
		// Jika tidak ada diskon set ke 0
		diskon.Diskon = 0
	}

	totalBayarSebelumDiskon := float64(input.Dewasa)*price.HargaDewasa + float64(input.Anak)*price.HargaAnak
	diskonAmount := 0.0
	potongan := 0.0
	if input.Anak > 0 && diskon.Diskon > 0 {
		diskonAmount = diskon.Diskon
		potongan = (float64(input.Anak) * price.HargaAnak) * (diskonAmount / 100)
	}

	// totalBayarSetelahDiskon := totalBayarTmp - diskonAmount
	totalBayarSetelahDiskon := totalBayarSebelumDiskon - potongan
	jmlPengunjung := input.Dewasa + input.Anak

	fmt.Println("==== DEBUG BOOKING ====")
	fmt.Println("Harga Dewasa:", price.HargaDewasa)
	fmt.Println("Harga Anak:", price.HargaAnak)
	fmt.Println("Jumlah Dewasa:", input.Dewasa)
	fmt.Println("Jumlah Anak:", input.Anak)
	fmt.Println("TOTAL BAYAR SEBELUM DISKON:", totalBayarSebelumDiskon)
	fmt.Println("Tunai Diberikan:", input.Tunai)
	fmt.Println("========================")
	fmt.Println("TOTAL BAYAR SETELAH DISKON:", totalBayarSetelahDiskon)

	if input.Tunai < totalBayarSetelahDiskon {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tunai tidak mencukupi"})
		return
	}

	qrCode, err := GenerateQRCode(input.KodeBooking)
	if err != nil {
		fmt.Println("Failed to generate QR Code:", err)
		return
	}

	// --- TRANSACTION START
	tx := models.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat transaksi"})
		return
	}

	// Ambil kapasitas dan kunci baris (FOR UPDATE agar aman dari race condition)
	var kapasitas models.Capacities
	if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&kapasitas).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data kuota"})
		return
	}

	// --- VALIDATION
	if float64(input.Dewasa) > kapasitas.MaxDewasa || float64(input.Anak) > kapasitas.MaxAnak {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Kuota tidak cukup"})
		return
	}

	// Kurangi kuota
	kapasitas.MaxDewasa -= float64(input.Dewasa)
	kapasitas.MaxAnak -= float64(input.Anak)

	if err := tx.Save(&kapasitas).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan perubahan"})
		return
	}

	// --- BOOKING DATA
	inputDate := time.Now()

	// Format ulang untuk ditampilkan (misalnya untuk menampilkan ke pengguna)
	tglPesan := inputDate.Format("2006-01-02 15:04:05")
	tglCheckin := time.Now()
	// tglKadaluarsaStr := kadaluarsa.Format("02-01-2006 15:04:05")

	// Simpan ke table checkin
	booking := models.Checkins{
		KodeBooking:      input.KodeBooking,
		TransaksiId:      input.TransaksiId,
		QRCode:           qrCode,
		TglPemesananStr:  tglPesan,
		CheckinAt:        tglCheckin,
		Kasir:            input.Kasir,
		NamaPemesan:      input.NamaPemesan,
		Dewasa:           input.Dewasa,
		Harga1:           price.HargaDewasa,
		Anak:             input.Anak,
		Harga2:           price.HargaAnak,
		JmlPengunjung:    jmlPengunjung,
		MetodePembayaran: "Cash",
		TotalBayar:       totalBayarSebelumDiskon,
		Diskon:           diskonAmount,
		TotalBayar2:      totalBayarSetelahDiskon,
		Tunai:            input.Tunai,
		PaymentStatus:    "Sudah dibayar",
		CheckinStatus:    "Sudah digunakan",
	}

	if err := tx.Create(&booking).Error; err != nil {
		log.Println("Error saving data:", err)
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data booking"})
		return
	}

	// -- TRANSACTION END
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed transaction"})
		return
	}

	// Kirim ke frontend
	c.JSON(http.StatusOK, gin.H{
		"message":          "Pemesanan berhasil",
		"total_bayar":      totalBayarSebelumDiskon,
		"kode_booking":     input.KodeBooking,
		"booking":          booking,
		"kasir":            input.Kasir,
		"harga1":           price.HargaDewasa,
		"harga2":           price.HargaAnak,
		"total_sbl_diskon": totalBayarSebelumDiskon,
		"total_stl_diskon": totalBayarSetelahDiskon,
		"diskon":           potongan,
	})

}

// Hitung total booking
func HitungTotalBooking(c *gin.Context) {
	var input struct {
		Dewasa int `json:"dewasa"`
		Anak   int `json:"anak"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	// Ambil harga ticket dari database
	var price models.Price
	if err := models.DB.First(&price).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data harga"})
		return
	}

	// Hitung total bayar
	harga1 := price.HargaDewasa
	harga2 := price.HargaAnak
	jmlPengunjung := input.Dewasa + input.Anak
	totalBayar := float64(input.Dewasa)*harga1 + float64(input.Anak)*harga2

	c.JSON(http.StatusOK, gin.H{
		"hargaDewasa":      harga1,
		"hargaAnak":        harga2,
		"jumlahPengunjung": jmlPengunjung,
		"totalBayar":       totalBayar,
	})
}

// GET /api/booking/kode
func GetTransaksiId(c *gin.Context) {
	// Generate code booking
	kodeBooking := GenerateBookingCode()

	// Ambil lokasi zona waktu Asia/Jakarta
	loc, err := time.LoadLocation("Asia/Jakarta")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat zona waktu"})
		return
	}

	// Ambil waktu sekarang
	now := time.Now().In(loc)
	tanggal := now.Format("02012006")
	tanggal2 := now.Format("02/01/2006")
	waktu := now.Format("15.04")

	// Gabungkan semuanya
	transaksiId := "TRX#" + tanggal + kodeBooking
	trxId := "RSV#" + tanggal + kodeBooking

	c.JSON(http.StatusOK, gin.H{
		"kode_booking": kodeBooking,
		"transaksi_id": transaksiId,
		"trx_id":       trxId,
		"tgl_input":    tanggal2,
		"waktu_input":  waktu,
	})
}

func GenerateNoInvoice(initial string) string {
	loc, _ := time.LoadLocation("Asia/Jakarta")
	t := time.Now().In(loc)
	dataPart := t.Format("20060102")

	// Generate 4 digit random number
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	randomNum := r.Intn(9999) + 1
	randomPart := fmt.Sprintf("%04d", randomNum)

	return fmt.Sprintf("INV-%s%s%s", initial, dataPart, randomPart)
}

func GetNoInvoice(c *gin.Context) {
	noInvoice := GenerateNoInvoice("RSV")

	loc, _ := time.LoadLocation("Asia/Jakarta")
	now := time.Now().In(loc)

	c.JSON(http.StatusOK, gin.H{
		"no_invoice":  noInvoice,
		"tgl_invoice": now.Format("2006-01-02 15:04:05"),
	})
}

func GetTotalBayar(c *gin.Context) {
	// Deklarasikan struct untuk menangkap body request
	var RequestData struct {
		Dewasa int `json:"dewasa"`
		Anak   int `json:"anak"`
	}

	// Bind JSON dari body request
	if err := c.ShouldBindJSON(&RequestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	fmt.Print("Received Dewasa:", RequestData.Dewasa, "Anak:", RequestData.Anak)

	var price models.Price
	if err := models.DB.First(&price).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch prices"})
		return
	}

	// Ambil diskon yang berlaku untuk anak-anak
	var diskon models.Discount
	if err := models.DB.Where("kategori_tiket = ? AND CURRENT_DATE BETWEEN mulai_tanggal AND akhir_tanggal", "Anak").First(&diskon).Error; err != nil {
		// Jika tidak ada diskon set ke 0
		diskon.Diskon = 0
	}

	// Hitung total bayar
	totalBayarTmp := float64(RequestData.Dewasa)*price.HargaDewasa + float64(RequestData.Anak)*price.HargaAnak

	// Hitung potongan diskon hanya jika ada anak dan diskon berlaku
	diskonAmount := 0.0
	potongan := 0.0
	if RequestData.Anak > 0 && diskon.Diskon > 0 {
		diskonAmount = diskon.Diskon
		potongan = (float64(RequestData.Anak) * price.HargaAnak) * (diskonAmount / 100)
	}

	// totalBayarDiskon := totalBayarTmp - diskonAmount
	totalBayarDiskon := totalBayarTmp - potongan

	// Ambil kapasitas
	var quota models.Capacities
	if err := models.DB.First(&quota).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch capacity"})
		return
	}

	// Cek apakah kapasitas mencukupi
	if float64(RequestData.Dewasa) > quota.MaxDewasa || float64(RequestData.Anak) > quota.MaxAnak {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Jumlah melebihi kapasitas"})
		return
	}

	// Kurangin kapasitas
	quota.MaxDewasa -= float64(RequestData.Dewasa)
	quota.MaxAnak -= float64(RequestData.Anak)

	// Kirim hasil ke frontend
	c.JSON(http.StatusOK, gin.H{
		"hargaDewasa":        price.HargaDewasa,
		"hargaAnak":          price.HargaAnak,
		"total_bayar_tmp":    totalBayarTmp,
		"total_bayar_diskon": totalBayarDiskon,
		"sisa_dewasa":        quota.MaxDewasa,
		"sisa_anak":          quota.MaxAnak,
		"diskon":             potongan,
	})
}

func GetPrice(c *gin.Context) {
	var price models.Price

	// Ambil data harga dari tabel price (asumsikan hanya ada 1 record)
	if err := models.DB.First(&price).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch price data"})
		return
	}

	// Tambahkan log untuk memeriksa data yang diambil
	fmt.Printf("Price Data: %+v\n", price)

	// Kirim data harga ke frontend
	c.JSON(http.StatusOK, gin.H{
		"harga_dewasa": price.HargaDewasa,
		"harga_anak":   price.HargaAnak,
	})
}

func GetCapacities(c *gin.Context) {
	var quota models.Capacities

	if err := models.DB.First(&quota).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch capacity"})
		return
	}

	fmt.Printf("Capacity: %+v\n", quota)

	c.JSON(http.StatusOK, gin.H{
		"max_dewasa": quota.MaxDewasa,
		"max_anak":   quota.MaxAnak,
	})
}

func GetUsername(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("auth_login") // Ambil username dari sesi

	if username == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authentication"})
		return
	}

	// Ambil data lengkap operator
	var operator models.Operator
	if err := models.DB.Where("username = ?", username).First(&operator).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	// fmt.Printf("Username di sesi: %v\n", username)
	c.JSON(http.StatusOK, gin.H{
		"fullname": operator.Fullname, // Kirim name ke frontend
	})
}

func AuthLogin(c *gin.Context) {
	session := sessions.Default(c)

	// Ambil informasi username dan role dari sesi
	authUsername := session.Get("auth_login")
	authRole := session.Get("auth_role")

	// Jika pengguna sudah login, arahkan berdasarkan role
	if authUsername != nil && authRole != nil {
		switch authRole {
		case "admin":
			c.Redirect(http.StatusFound, "/auth/dashboard/admin")
		case "operator":
			c.Redirect(http.StatusFound, "/auth/dashboard/operator")
		default:
			c.JSON(http.StatusForbidden, gin.H{"error": "User role not recognized"})
			return
		}
		return
	}

	// Jika belum login, tampilkan form login
	c.HTML(http.StatusOK, "Auth Login", gin.H{
		"title": "Auth Login",
	})
}
