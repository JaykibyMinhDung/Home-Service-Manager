package com.movingservice.auth;

import com.movingservice.user.UserService;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /** Nạp tài khoản từ CSDL theo email, đổi vai trò thành quyền ROLE_CUSTOMER, ROLE_STAFF hoặc ROLE_ADMIN. */
    @Bean
    public UserDetailsService userDetailsService(UserService userService) {
        return email -> userService.findByEmail(email)
                .map(user -> User.withUsername(user.getEmail())
                        .password(user.getPasswordHash())
                        .roles(user.getRole().name())
                        .disabled(!user.isActive())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException(email));
    }

    /** Bảng phân quyền theo đường dẫn. Mọi quy tắc "ai gọi được API nào" nằm ở đây. */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http, JwtService jwtService, UserDetailsService userDetailsService)
            throws Exception {
        http
                // API dùng JWT trong header, không dùng cookie hay session nên không cần CSRF.
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        // Công khai
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vehicle-types", "/api/extra-services").permitAll()
                        // Theo vai trò
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/orders/**").hasRole("CUSTOMER")
                        // Còn lại: chỉ cần đăng nhập
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, ex) -> writeError(
                                response, HttpStatus.UNAUTHORIZED, "Bạn chưa đăng nhập hoặc phiên đã hết hạn"))
                        .accessDeniedHandler((request, response, ex) -> writeError(
                                response, HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này")))
                .addFilterBefore(
                        new JwtAuthFilter(jwtService, userDetailsService),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    private static void writeError(HttpServletResponse response, HttpStatus status, String message)
            throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
                "{\"status\":%d,\"message\":\"%s\",\"data\":null}".formatted(status.value(), message));
    }
}
