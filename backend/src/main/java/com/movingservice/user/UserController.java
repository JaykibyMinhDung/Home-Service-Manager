package com.movingservice.user;

import com.movingservice.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Hồ sơ của tài khoản đang đăng nhập (API 3, 4, 5). */
@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    public record UpdateProfileRequest(
            @NotBlank(message = "Họ tên không được để trống")
            @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
            String fullName,

            @NotBlank(message = "Số điện thoại không được để trống")
            @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0")
            String phone) {
    }

    public record ChangePasswordRequest(
            @NotBlank(message = "Mật khẩu cũ không được để trống")
            String oldPassword,

            @NotBlank(message = "Mật khẩu mới không được để trống")
            @Size(min = 6, max = 72, message = "Mật khẩu mới từ 6 đến 72 ký tự")
            String newPassword) {
    }

    @GetMapping
    public ApiResponse<UserResponse> me(Authentication authentication) {
        return ApiResponse.ok(UserResponse.from(userService.getByEmail(authentication.getName())));
    }

    @PutMapping
    public ApiResponse<UserResponse> updateProfile(
            Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok(UserResponse.from(
                userService.updateProfile(authentication.getName(), request.fullName(), request.phone())));
    }

    @PutMapping("/password")
    public ApiResponse<Void> changePassword(
            Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request.oldPassword(), request.newPassword());
        return ApiResponse.message("Đã đổi mật khẩu");
    }
}
