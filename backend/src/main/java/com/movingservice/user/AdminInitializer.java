package com.movingservice.user;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Tạo tài khoản admin mặc định ở lần chạy đầu tiên, lấy email và mật khẩu từ application.properties. */
@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserService userService;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userService.findByEmail(adminEmail).isEmpty()) {
            userService.createUser("Quản trị viên", adminEmail, "0900000000", adminPassword, Role.ADMIN);
        }
    }
}
