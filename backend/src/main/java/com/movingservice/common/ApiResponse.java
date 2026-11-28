package com.movingservice.common;

import org.springframework.http.HttpStatus;

public record ApiResponse<T>(int status, String message, T data) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(HttpStatus.OK.value(), "Thành công", data);
    }

    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(HttpStatus.CREATED.value(), "Tạo mới thành công", data);
    }

    public static ApiResponse<Void> message(String message) {
        return new ApiResponse<>(HttpStatus.OK.value(), message, null);
    }

    public static ApiResponse<Void> error(HttpStatus status, String message) {
        return new ApiResponse<>(status.value(), message, null);
    }
}
