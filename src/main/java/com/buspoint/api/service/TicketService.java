package com.buspoint.api.service;

import com.buspoint.api.dto.TicketDto;
import com.buspoint.api.exception.BadRequestException;
import com.buspoint.api.exception.NotFoundException;
import com.buspoint.api.model.Route;
import com.buspoint.api.model.Ticket;
import com.buspoint.api.model.User;
import com.buspoint.api.repository.RouteRepository;
import com.buspoint.api.repository.TicketRepository;
import com.buspoint.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final MailService mailService;

    public Ticket createTicket(String userEmail, TicketDto.CreateRequest request) {
        if (request.getQuantityAdult() + request.getQuantityChild() == 0) {
            throw new BadRequestException("Must purchase at least one ticket");
        }

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new NotFoundException("Route not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        double total = (request.getQuantityAdult() * route.getPriceAdult())
                + (request.getQuantityChild() * route.getPriceChild());

        Ticket ticket = new Ticket();
        ticket.setUserId(user.getId());
        ticket.setRouteId(route.getId());
        ticket.setRouteName(route.getName());
        ticket.setTravelDate(request.getTravelDate());
        ticket.setQuantityAdult(request.getQuantityAdult());
        ticket.setQuantityChild(request.getQuantityChild());
        ticket.setTotalPrice(total);
        ticket.setStatus("CONFIRMED");
        ticket.setQrCode(UUID.randomUUID().toString());

        Ticket saved = ticketRepository.save(ticket);
        mailService.sendTicketConfirmation(user.getEmail(), saved.getId(), route.getName());

        return saved;
    }

    public List<Ticket> getUserTickets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return ticketRepository.findByUserId(user.getId());
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
    }

    public Ticket cancelTicket(String id, String userEmail) {
        Ticket ticket = getTicketById(id);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!ticket.getUserId().equals(user.getId())) {
            throw new BadRequestException("You don't own this ticket");
        }
        if ("CANCELLED".equals(ticket.getStatus())) {
            throw new BadRequestException("Ticket is already cancelled");
        }

        ticket.setStatus("CANCELLED");
        return ticketRepository.save(ticket);
    }
}
