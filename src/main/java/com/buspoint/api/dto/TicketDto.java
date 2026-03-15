package com.buspoint.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

public class TicketDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String routeId;

        @NotNull
        @Future(message = "Travel date must be in the future")
        private LocalDate travelDate;

        @Min(0)
        private int quantityAdult;

        @Min(0)
        private int quantityChild;
    }

    @Data
    public static class Response {
        private String id;
        private String routeName;
        private LocalDate travelDate;
        private int quantityAdult;
        private int quantityChild;
        private double totalPrice;
        private String status;
        private String qrCode;
    }
}
