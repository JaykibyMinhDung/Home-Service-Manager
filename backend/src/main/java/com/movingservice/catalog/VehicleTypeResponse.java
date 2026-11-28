package com.movingservice.catalog;

import java.math.BigDecimal;

public record VehicleTypeResponse(
        Long id, String name, int capacityKg, BigDecimal basePrice, BigDecimal pricePerKm, boolean active) {

    public static VehicleTypeResponse from(VehicleType type) {
        return new VehicleTypeResponse(
                type.getId(),
                type.getName(),
                type.getCapacityKg(),
                type.getBasePrice(),
                type.getPricePerKm(),
                type.isActive());
    }
}
