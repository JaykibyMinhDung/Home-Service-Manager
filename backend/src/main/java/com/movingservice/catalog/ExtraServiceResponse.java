package com.movingservice.catalog;

import java.math.BigDecimal;

public record ExtraServiceResponse(Long id, String name, String description, BigDecimal price, boolean active) {

    public static ExtraServiceResponse from(ExtraService service) {
        return new ExtraServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.isActive());
    }
}
