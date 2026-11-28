package com.movingservice.catalog;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record VehicleTypeRequest(
        @NotBlank(message = "Tên loại xe không được để trống")
        @Size(max = 100, message = "Tên loại xe tối đa 100 ký tự")
        String name,

        @NotNull(message = "Tải trọng không được để trống")
        @Positive(message = "Tải trọng phải lớn hơn 0")
        Integer capacityKg,

        @NotNull(message = "Giá mở cửa không được để trống")
        @PositiveOrZero(message = "Giá mở cửa từ 0 trở lên")
        @Digits(integer = 12, fraction = 0, message = "Giá mở cửa phải là số nguyên")
        BigDecimal basePrice,

        @NotNull(message = "Giá mỗi km không được để trống")
        @PositiveOrZero(message = "Giá mỗi km từ 0 trở lên")
        @Digits(integer = 12, fraction = 0, message = "Giá mỗi km phải là số nguyên")
        BigDecimal pricePerKm,

        Boolean active) {
}
