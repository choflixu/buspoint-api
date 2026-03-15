package com.buspoint.api.controller;

import com.buspoint.api.dto.TicketDto;
import com.buspoint.api.model.Ticket;
import com.buspoint.api.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Tag(name = "Tickets", description = "Ticket purchase and management")
@SecurityRequirement(name = "bearerAuth")
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    @Operation(summary = "Purchase tickets for a route")
    public ResponseEntity<Ticket> create(
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody TicketDto.CreateRequest request) {
        return ResponseEntity.ok(ticketService.createTicket(userEmail, request));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my tickets")
    public ResponseEntity<List<Ticket>> getMyTickets(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(ticketService.getUserTickets(userEmail));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get ticket by ID")
    public ResponseEntity<Ticket> getById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a ticket")
    public ResponseEntity<Ticket> cancel(
            @PathVariable String id,
            @AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(ticketService.cancelTicket(id, userEmail));
    }
}
