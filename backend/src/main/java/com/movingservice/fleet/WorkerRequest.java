package com.movingservice.fleet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record WorkerRequest(
        @NotBlank(message = "Họ tên không được để trống")
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
        String fullName,

        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0")
        String phone,

        @NotNull(message = "Chọn vị trí")
        Worker.Position position,

        Worker.Status status) {
}
