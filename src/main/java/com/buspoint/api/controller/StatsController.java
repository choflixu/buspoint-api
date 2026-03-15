package com.buspoint.api.controller;

import com.buspoint.api.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin — Stats", description = "Sales statistics and reporting")
@SecurityRequirement(name = "bearerAuth")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(summary = "Global platform stats")
    public ResponseEntity<Map<String, Object>> getGlobal() {
        return ResponseEntity.ok(statsService.getGlobalStats());
    }

    @GetMapping("/route/{routeId}")
    @Operation(summary = "Stats for a specific route")
    public ResponseEntity<Map<String, Object>> getByRoute(@PathVariable String routeId) {
        return ResponseEntity.ok(statsService.getStatsByRoute(routeId));
    }

    @GetMapping("/range")
    @Operation(summary = "Stats for a date range")
    public ResponseEntity<Map<String, Object>> getByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(statsService.getStatsByDateRange(from, to));
    }
}
