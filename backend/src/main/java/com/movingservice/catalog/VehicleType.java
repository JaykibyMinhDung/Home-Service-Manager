package com.movingservice.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Loại xe và đơn giá: giá mở cửa + giá theo km. */
@Entity
@Table(name = "vehicle_types")
@Getter
@Setter
@NoArgsConstructor
public class VehicleType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    /** Tải trọng, tính bằng kg. */
    @Column(nullable = false)
    private int capacityKg;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal basePrice;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal pricePerKm;

    @Column(nullable = false)
    private boolean active = true;
}
