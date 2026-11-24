package com.movingservice.user;

/** Thông tin tài khoản trả về cho giao diện. Không bao giờ chứa mật khẩu. */
public record UserResponse(Long id, String fullName, String email, String phone, Role role, boolean active) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive());
    }
}
