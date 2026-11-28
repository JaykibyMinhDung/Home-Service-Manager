package com.movingservice.fleet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VehicleRequest(
        @NotBlank(message = "Biển số không được để trống")
        @Size(max = 20, message = "Biển số tối đa 20 ký tự")
        String licensePlate,

        @NotNull(message = "Chọn loại xe")
        Long vehicleTypeId,

        Vehicle.Status status) {
}
