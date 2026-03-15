package com.buspoint.api.controller;

import com.buspoint.api.model.Route;
import com.buspoint.api.repository.RouteRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@Tag(name = "Routes", description = "Tourist bus routes")
@SecurityRequirement(name = "bearerAuth")
public class RouteController {

    private final RouteRepository routeRepository;

    @GetMapping
    @Operation(summary = "Get all active routes")
    public ResponseEntity<List<Route>> getAll() {
        return ResponseEntity.ok(routeRepository.findByActiveTrue());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get route by ID")
    public ResponseEntity<Route> getById(@PathVariable String id) {
        return routeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Get routes by city")
    public ResponseEntity<List<Route>> getByCity(@PathVariable String city) {
        return ResponseEntity.ok(routeRepository.findByCityIgnoreCase(city));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new route (Admin only)")
    public ResponseEntity<Route> create(@RequestBody Route route) {
        return ResponseEntity.ok(routeRepository.save(route));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a route (Admin only)")
    public ResponseEntity<Route> update(@PathVariable String id, @RequestBody Route updated) {
        return routeRepository.findById(id).map(route -> {
            updated.setId(id);
            return ResponseEntity.ok(routeRepository.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate a route (Admin only)")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        routeRepository.findById(id).ifPresent(route -> {
            route.setActive(false);
            routeRepository.save(route);
        });
        return ResponseEntity.noContent().build();
    }
}
