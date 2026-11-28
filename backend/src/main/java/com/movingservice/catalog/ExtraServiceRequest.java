package com.movingservice.catalog;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ExtraServiceRequest(
        @NotBlank(message = "Tên dịch vụ không được để trống")
        @Size(max = 100, message = "Tên dịch vụ tối đa 100 ký tự")
        String name,

        @Size(max = 500, message = "Mô tả tối đa 500 ký tự")
        String description,

        @NotNull(message = "Giá không được để trống")
        @PositiveOrZero(message = "Giá từ 0 trở lên")
        @Digits(integer = 12, fraction = 0, message = "Giá phải là số nguyên")
        BigDecimal price,

        Boolean active) {
}
