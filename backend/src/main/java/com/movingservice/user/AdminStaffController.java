package com.movingservice.user;

import com.movingservice.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class AdminStaffController {

    private final UserService userService;

    public record CreateStaffRequest(
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

    public record SetActiveRequest(@NotNull(message = "Chọn trạng thái tài khoản") Boolean active) {
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> list() {
        return ApiResponse.ok(userService.listByRole(Role.STAFF).stream().map(UserResponse::from).toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserResponse> create(@Valid @RequestBody CreateStaffRequest request) {
        return ApiResponse.created(UserResponse.from(userService.createUser(
                request.fullName(), request.email(), request.phone(), request.password(), Role.STAFF)));
    }

    @PutMapping("/{id}/active")
    public ApiResponse<UserResponse> setActive(@PathVariable Long id, @Valid @RequestBody SetActiveRequest request) {
        return ApiResponse.ok(UserResponse.from(userService.setStaffActive(id, request.active())));
    }
}
