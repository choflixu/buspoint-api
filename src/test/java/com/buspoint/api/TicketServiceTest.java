package com.buspoint.api;

import com.buspoint.api.dto.TicketDto;
import com.buspoint.api.exception.BadRequestException;
import com.buspoint.api.model.Route;
import com.buspoint.api.model.Ticket;
import com.buspoint.api.model.User;
import com.buspoint.api.repository.RouteRepository;
import com.buspoint.api.repository.TicketRepository;
import com.buspoint.api.repository.UserRepository;
import com.buspoint.api.service.MailService;
import com.buspoint.api.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock private TicketRepository ticketRepository;
    @Mock private RouteRepository routeRepository;
    @Mock private UserRepository userRepository;
    @Mock private MailService mailService;

    @InjectMocks private TicketService ticketService;

    private User user;
    private Route route;
    private TicketDto.CreateRequest request;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("user1");
        user.setEmail("test@example.com");

        route = new Route();
        route.setId("route1");
        route.setName("Ruta Centro");
        route.setPriceAdult(15.0);
        route.setPriceChild(8.0);

        request = new TicketDto.CreateRequest();
        request.setRouteId("route1");
        request.setTravelDate(LocalDate.now().plusDays(3));
        request.setQuantityAdult(2);
        request.setQuantityChild(1);
    }

    @Test
    void createTicket_success_calculatesCorrectPrice() {
        when(routeRepository.findById("route1")).thenReturn(Optional.of(route));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(ticketRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Ticket result = ticketService.createTicket("test@example.com", request);

        // 2 adults * 15 + 1 child * 8 = 38
        assertEquals(38.0, result.getTotalPrice());
        assertEquals("CONFIRMED", result.getStatus());
        verify(mailService).sendTicketConfirmation(anyString(), any(), anyString());
    }

    @Test
    void createTicket_zeroQuantity_throws() {
        request.setQuantityAdult(0);
        request.setQuantityChild(0);

        assertThrows(BadRequestException.class,
                () -> ticketService.createTicket("test@example.com", request));
    }

    @Test
    void cancelTicket_success() {
        Ticket ticket = new Ticket();
        ticket.setId("t1");
        ticket.setUserId("user1");
        ticket.setStatus("CONFIRMED");

        when(ticketRepository.findById("t1")).thenReturn(Optional.of(ticket));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(ticketRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Ticket result = ticketService.cancelTicket("t1", "test@example.com");

        assertEquals("CANCELLED", result.getStatus());
    }

    @Test
    void cancelTicket_alreadyCancelled_throws() {
        Ticket ticket = new Ticket();
        ticket.setId("t1");
        ticket.setUserId("user1");
        ticket.setStatus("CANCELLED");

        when(ticketRepository.findById("t1")).thenReturn(Optional.of(ticket));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class,
                () -> ticketService.cancelTicket("t1", "test@example.com"));
    }
}
