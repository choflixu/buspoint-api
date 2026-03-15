package com.buspoint.api.service;

import com.buspoint.api.repository.RouteRepository;
import com.buspoint.api.repository.TicketRepository;
import com.buspoint.api.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final RouteRepository routeRepository;

    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalTickets", ticketRepository.count());
        stats.put("confirmedTickets", ticketRepository.countByStatus("CONFIRMED"));
        stats.put("cancelledTickets", ticketRepository.countByStatus("CANCELLED"));
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRoutes", routeRepository.count());

        double revenue = ticketRepository.findAll().stream()
                .filter(t -> "CONFIRMED".equals(t.getStatus()) || "USED".equals(t.getStatus()))
                .mapToDouble(t -> t.getTotalPrice())
                .sum();
        stats.put("totalRevenue", revenue);

        return stats;
    }

    public Map<String, Object> getStatsByRoute(String routeId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("routeId", routeId);
        stats.put("totalTickets", ticketRepository.countByRouteId(routeId));

        double revenue = ticketRepository.findByRouteId(routeId).stream()
                .filter(t -> "CONFIRMED".equals(t.getStatus()) || "USED".equals(t.getStatus()))
                .mapToDouble(t -> t.getTotalPrice())
                .sum();
        stats.put("revenue", revenue);

        return stats;
    }

    public Map<String, Object> getStatsByDateRange(LocalDate from, LocalDate to) {
        var tickets = ticketRepository.findByTravelDateBetween(from, to);
        Map<String, Object> stats = new HashMap<>();
        stats.put("from", from);
        stats.put("to", to);
        stats.put("totalTickets", tickets.size());
        stats.put("revenue", tickets.stream()
                .filter(t -> "CONFIRMED".equals(t.getStatus()) || "USED".equals(t.getStatus()))
                .mapToDouble(t -> t.getTotalPrice()).sum());
        return stats;
    }
}
