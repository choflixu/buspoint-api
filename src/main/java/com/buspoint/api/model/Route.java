package com.buspoint.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "routes")
public class Route {

    @Id
    private String id;

    private String name;         // e.g. "Ruta Centro Histórico"
    private String city;
    private String description;
    private List<String> stops;  // ordered list of stop names
    private double priceAdult;
    private double priceChild;
    private int durationMinutes;
    private boolean active = true;
}
