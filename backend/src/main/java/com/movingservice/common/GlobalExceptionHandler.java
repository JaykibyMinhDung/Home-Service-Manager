package com.movingservice.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Chuyển mọi lỗi thành cùng một định dạng ApiResponse cho giao diện. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException e) {
        return error(e.getStatus(), e.getMessage());
    }

    /** Dữ liệu gửi lên vi phạm ràng buộc @Valid: trả về thông báo của trường đầu tiên bị lỗi. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Dữ liệu gửi lên không hợp lệ");
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler({
            HttpMessageNotReadableException.class,
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ApiResponse<Void>> handleUnreadable(Exception e) {
        return error(HttpStatus.BAD_REQUEST, "Dữ liệu gửi lên không hợp lệ");
    }

    private ResponseEntity<ApiResponse<Void>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiResponse.error(status, message));
    }
}
