package com.buspoint.api.repository;

import com.buspoint.api.model.Route;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RouteRepository extends MongoRepository<Route, String> {
    List<Route> findByActiveTrue();
    List<Route> findByCityIgnoreCase(String city);
}
