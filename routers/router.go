package routers

import (
	"log"
	"net/http"
	"swmpool/controllers"
	"swmpool/middlewares"
	"swmpool/templates"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	store := cookie.NewStore([]byte("dDskjsasfasjbchiusdyiFFKJhjdsfDoioajfDKFjHjkiifojafjDSPPPFK"))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	r.Use(sessions.Sessions("sessionStore", store))

	r.Static("/static", "./static")
	// r.HTMLRender = views.LoadTemplates()
	r.HTMLRender = templates.LoadTemplates()

	log.Println("Templates loaded successfully")

	r.GET("/", middlewares.AuthLoginRequired())
	r.GET("/auth/login", controllers.AuthLogin)
	r.GET("/ticket-offline", middlewares.AuthLoginRequired(), controllers.GetTicketOffline)
	r.GET("/ticket-online", middlewares.AuthLoginRequired(), controllers.GetTicketOnline)
	r.GET("/ticket-reservation", middlewares.AuthLoginRequired(), controllers.GetTicketReservation)

	r.GET("/username", controllers.GetUsername)
	r.GET("/price", controllers.GetPrice)
	r.POST("/total-bayar", controllers.GetTotalBayar)
	r.POST("/booking-offline", controllers.BookingTicketOffline)
	r.GET("/api/capacities", controllers.GetCapacities)
	r.GET("/transaksi-id", controllers.GetTransaksiId)
	r.GET("/booking/:kodeBooking", controllers.GetCodeBooking)
	r.POST("/checkin/:kode", controllers.CheckinHandler)
	r.POST("/reservation", controllers.ReservationTicket)
	r.GET("/invoice", controllers.GetNoInvoice)

	auth := r.Group("/auth")
	auth.Use(middlewares.NoCache()) // Middleware untuk mencegah cache

	// Dashboard Admin
	auth.GET("/dashboard/admin", middlewares.AuthLoginRequired(), controllers.GetDashboardAdmin)

	// Dashboard Operator
	auth.GET("/dashboard/operator", middlewares.AuthLoginRequired(), controllers.GetDashboardOperator)

	// Dashboard overview
	auth.GET("/dashboard", middlewares.AuthLoginRequired(), controllers.GetDashboardOverview)

	// Manajemen Tiket
	auth.GET("/ticket-management", middlewares.AuthLoginRequired(), controllers.GetManagemenTicket)

	// Report Transaction
	auth.GET("/transaction-report", middlewares.AuthLoginRequired(), controllers.GetTransactionReport)

	// Visitor Report
	auth.GET("/visitor-report", middlewares.AuthLoginRequired(), controllers.GetVisitorReport)

	// Setting
	auth.GET("/setting", middlewares.AuthLoginRequired(), controllers.GetSetting)

	r.POST("/auth/login", controllers.Login)

	r.DELETE("/logout", controllers.Logout)

	return r

}
