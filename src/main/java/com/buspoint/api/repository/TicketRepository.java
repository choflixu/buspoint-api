package com.buspoint.api.repository;

import com.buspoint.api.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByRouteId(String routeId);
    List<Ticket> findByStatus(String status);
    List<Ticket> findByTravelDateBetween(LocalDate from, LocalDate to);
    long countByStatus(String status);
    long countByRouteId(String routeId);
}
