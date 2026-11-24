package com.movingservice.user;

import com.movingservice.common.ApiException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Cổng vào của module user: các module khác làm việc với tài khoản qua lớp này. */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email));
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return findByEmail(email)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy tài khoản"));
    }

    @Transactional
    public User createUser(String fullName, String email, String phone, String rawPassword, Role role) {
        String normalizedEmail = normalizeEmail(email);
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw ApiException.conflict("Email đã được sử dụng");
        }
        User user = new User();
        user.setFullName(fullName.trim());
        user.setEmail(normalizedEmail);
        user.setPhone(phone.trim());
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public User updateProfile(String email, String fullName, String phone) {
        User user = getByEmail(email);
        user.setFullName(fullName.trim());
        user.setPhone(phone.trim());
        return user;
    }

    @Transactional
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = getByEmail(email);
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw ApiException.badRequest("Mật khẩu cũ không đúng");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
    }

    public boolean passwordMatches(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPasswordHash());
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
