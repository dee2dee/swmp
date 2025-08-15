package middlewares

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func AuthRequired(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)

		// Ambil informasi username dan role dari session
		authUsername := session.Get("auth_login")
		authRole := session.Get("auth_role")

		fmt.Printf("Auth Username: %v, Auth Role: %v\n", authUsername, authRole)

		// Jika tidak ada session login, arahkan ke halaman login
		if authUsername == nil || authRole == nil {
			c.Redirect(http.StatusFound, "/auth/login")
			c.Abort()
			return
		}

		// Logika akses berdasarkan role
		if requiredRole != authRole && authRole != "admin" {
			// Jika role pengguna tidak sesuai dan bukan admin, kembalikan 403 Forbidden
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to access this resource"})
			c.Abort()
			return
		}

		// Jika valid, lanjutkan request
		c.Next()

	}
}

func AuthLoginRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)

		// Ambil informasi username dan role dari sesi
		authUsername := session.Get("auth_login")
		authRole := session.Get("auth_role")

		// Jika sesi login tidak ada, arahkan ke halaman login
		if authUsername == nil || authRole == nil {
			c.Redirect(http.StatusFound, "/auth/login")
			c.Abort()
			return
		}

		switch authRole {
		case "admin":
			// Admin dapat mengakses /auth/dashboard/operator, /ticket-offline, /ticket-online, /auth/dashboard/admin
			c.Next()
		case "operator":
			// Operator hanya bisa mengakses /auth/dashboard/operator, /ticket-offline, dan /ticket-online
			if c.Request.URL.Path == "/auth/dashboard/operator" || c.Request.URL.Path == "/ticket-offline" || c.Request.URL.Path == "/ticket-online" || c.Request.URL.Path == "/ticket-reservation" {
				c.Next() // Lanjutkan ke handler berikutnya
			} else {
				// Jika akses ke dashboard admin atau rute lainnya selain operator, blokir
				c.JSON(http.StatusForbidden, gin.H{"error": "Access forbidden for this role"})
				c.Abort()
			}
		default:
			// Role tidak dikenal, beri pesan kesalahan
			c.JSON(http.StatusForbidden, gin.H{"error": "User role not recognized"})
		}

		// Batalkan permintaan agar tidak melanjutkan jika tidak memiliki akses yang sah
		c.Abort()
	}
}

func NoCache() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
		c.Header("Pragma", "no-cache")
		c.Header("Expires", "0")
		c.Next()
	}
}
