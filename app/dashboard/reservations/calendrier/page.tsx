"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, Info, ArrowLeft, List } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface Reservation {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  status: string
  customer: {
    firstName: string
    lastName: string
  }
}

export default function CalendrierPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [currentMonth])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/reservations")
      const data = await response.json()

      if (response.ok) {
        setReservations(data.reservations)
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getReservationsForDay = (day: Date) => {
    return reservations.filter((reservation) => {
      const checkIn = new Date(reservation.checkIn)
      const checkOut = new Date(reservation.checkOut)

      return isWithinInterval(day, { start: checkIn, end: checkOut }) || isSameDay(day, checkIn)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 border-green-500 text-green-900"
      case "PENDING":
        return "bg-yellow-100 border-yellow-500 text-yellow-900"
      case "CANCELLED":
        return "bg-red-100 border-red-500 text-red-900"
      case "COMPLETED":
        return "bg-blue-100 border-blue-500 text-blue-900"
      default:
        return "bg-gray-100 border-gray-500 text-gray-900"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmée"
      case "PENDING":
        return "En attente"
      case "CANCELLED":
        return "Annulée"
      case "COMPLETED":
        return "Terminée"
      default:
        return status
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Calculate days to show from previous/next month for a complete week grid
  const startDay = monthStart.getDay()
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - (startDay === 0 ? 6 : startDay - 1))

  const endDay = monthEnd.getDay()
  const endDate = new Date(monthEnd)
  endDate.setDate(endDate.getDate() + (endDay === 0 ? 0 : 7 - endDay))

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const goToToday = () => setCurrentMonth(new Date())

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/reservations"
          className="inline-flex items-center text-corsican-clay-600 hover:text-corsican-clay-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-corsican-clay-900 mb-2">
              Calendrier des réservations
            </h1>
            <p className="text-corsican-clay-700">
              Vue mensuelle de toutes les réservations
            </p>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-corsican-clay-600 text-white font-semibold hover:bg-corsican-clay-700 transition-all"
          >
            Aujourd'hui
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between bg-white rounded-xl border-2 border-corsican-clay-200 p-4">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-corsican-clay-50 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-corsican-clay-600" />
          </button>

          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-corsican-clay-600" />
            <h2 className="text-2xl font-serif font-bold text-corsican-clay-900">
              {format(currentMonth, "MMMM yyyy", { locale: fr })}
            </h2>
          </div>

          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-corsican-clay-50 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-corsican-clay-600" />
          </button>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-corsican-sand-50 rounded-lg border border-corsican-sand-200 p-4">
          <div className="flex items-start space-x-2 mb-3">
            <Info className="h-5 w-5 text-corsican-clay-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-corsican-clay-900 mb-2">Légende</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-corsican-clay-700">Confirmée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-corsican-clay-700">En attente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-corsican-clay-700">Terminée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-corsican-clay-700">Annulée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="text-center py-12 text-corsican-clay-600">
          Chargement...
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-corsican-clay-200 overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 bg-corsican-clay-50 border-b-2 border-corsican-clay-200">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div
                key={day}
                className="p-4 text-center font-semibold text-corsican-clay-900"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayReservations = getReservationsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-b border-r border-corsican-clay-100 p-2 ${
                    !isCurrentMonth ? "bg-gray-50" : ""
                  } ${isToday ? "bg-corsican-sand-50" : ""}`}
                >
                  <div className={`text-sm font-semibold mb-2 ${
                    !isCurrentMonth ? "text-corsican-clay-400" : "text-corsican-clay-900"
                  } ${isToday ? "text-corsican-clay-700" : ""}`}>
                    {format(day, "d")}
                    {isToday && (
                      <span className="ml-1 text-xs bg-corsican-clay-600 text-white px-2 py-0.5 rounded">
                        Aujourd'hui
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayReservations.map((reservation) => {
                      const isCheckIn = isSameDay(day, new Date(reservation.checkIn))
                      const isCheckOut = isSameDay(day, new Date(reservation.checkOut))

                      return (
                        <Link
                          key={reservation.id}
                          href={`/dashboard/reservations/${reservation.id}`}
                          className={`block text-xs p-1.5 rounded border-l-2 hover:shadow-md transition-all ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          <div className="font-semibold truncate">
                            {reservation.customer.firstName} {reservation.customer.lastName}
                          </div>
                          <div className="text-xs opacity-75">
                            {isCheckIn && "→ Arrivée"}
                            {isCheckOut && "← Départ"}
                            {!isCheckIn && !isCheckOut && `${reservation.guests} pers.`}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
