package templates

import (
	"github.com/gin-contrib/multitemplate"
)

func LoadTemplates() multitemplate.Renderer {
	tmpl := multitemplate.NewRenderer()
	tmpl.AddFromFiles("Auth Login", "views/login/login.html")
	tmpl.AddFromFiles("Admin", "views/dashboard/admin.html")
	tmpl.AddFromFiles("Operator", "views/dashboard/operator.html")
	tmpl.AddFromFiles("Ticket Offline", "views/dashboard/operator.html", "views/booking/ticket-offline.html")
	tmpl.AddFromFiles("Ticket Online", "views/dashboard/operator.html", "views/booking/ticket-online.html")
	tmpl.AddFromFiles("Ticket Reservation", "views/dashboard/operator.html", "views/booking/ticket-reserv.html")
	tmpl.AddFromFiles("Dashboard Overview", "views/dashboard/admin.html", "views/pages/dashboard.html")
	tmpl.AddFromFiles("Managemen Ticket", "views/dashboard/admin.html", "views/pages/ticket-management.html")
	tmpl.AddFromFiles("Transaction Report", "views/dashboard/admin.html", "views/pages/transaction-report.html")
	tmpl.AddFromFiles("Visitor Report", "views/dashboard/admin.html", "views/pages/visitor-report.html")
	tmpl.AddFromFiles("Setting", "views/dashboard/admin.html", "views/pages/setting.html")

	return tmpl
}
