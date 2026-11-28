package com.movingservice.auth;

import com.movingservice.common.ApiException;
import com.movingservice.common.ApiResponse;
import com.movingservice.user.Role;
import com.movingservice.user.User;
import com.movingservice.user.UserResponse;
import com.movingservice.user.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Đăng ký và đăng nhập (API 1, 2). */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public record RegisterRequest(
            @NotBlank(message = "Họ tên không được để trống")
            @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
            String fullName,

            @NotBlank(message = "Email không được để trống")
            @Email(message = "Email không đúng định dạng")
            @Size(max = 100, message = "Email tối đa 100 ký tự")
            String email,

            @NotBlank(message = "Số điện thoại không được để trống")
            @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0")
            String phone,

            @NotBlank(message = "Mật khẩu không được để trống")
            @Size(min = 6, max = 72, message = "Mật khẩu từ 6 đến 72 ký tự")
            String password) {
    }

    public record LoginRequest(
            @NotBlank(message = "Email không được để trống")
            String email,

            @NotBlank(message = "Mật khẩu không được để trống")
            String password) {
    }

    public record AuthResponse(String token, UserResponse user) {
    }

    /** Tự đăng ký luôn tạo tài khoản khách hàng. Tài khoản nhân viên do admin tạo. */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.createUser(
                request.fullName(), request.email(), request.phone(), request.password(), Role.CUSTOMER);
        return ApiResponse.created(toAuthResponse(user));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.email())
                .filter(found -> found.isActive() && userService.passwordMatches(found, request.password()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng"));
        return ApiResponse.ok(toAuthResponse(user));
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(jwtService.generateToken(user.getEmail()), UserResponse.from(user));
    }
}
