package com.movingservice.fleet;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Nhân sự đội vận chuyển (tài xế, bốc xếp). Không có tài khoản đăng nhập. */
@Entity
@Table(name = "workers")
@Getter
@Setter
@NoArgsConstructor
public class Worker {

    public enum Position {
        DRIVER,
        PORTER
    }

    public enum Status {
        AVAILABLE,  // Rảnh
        BUSY,       // Đang làm một đơn
        INACTIVE    // Đã nghỉ việc
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 15)
    private String phone;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private Position position;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private Status status = Status.AVAILABLE;
}
