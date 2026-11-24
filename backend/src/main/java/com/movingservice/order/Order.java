package com.movingservice.order;

import com.movingservice.catalog.ExtraService;
import com.movingservice.catalog.VehicleType;
import com.movingservice.fleet.Vehicle;
import com.movingservice.fleet.Worker;
import com.movingservice.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Đơn chuyển nhà. */
@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Order {

    public enum Status {
        PENDING,      // Chờ xác nhận
        CONFIRMED,    // Đã xác nhận
        IN_PROGRESS,  // Đang thực hiện
        COMPLETED,    // Hoàn thành
        CANCELLED     // Đã hủy
    }

    public enum PaymentStatus {
        UNPAID,     // Chưa thanh toán
        DEPOSITED,  // Đã cọc
        PAID        // Đã thanh toán
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id")
    private User customer;

    @Column(nullable = false, length = 255)
    private String pickupAddress;

    @Column(nullable = false, length = 255)
    private String deliveryAddress;

    @Column(nullable = false)
    private LocalDateTime movingTime;

    /** Quãng đường do khách tự nhập, tính bằng km. */
    @Column(nullable = false)
    private double distanceKm;

    @Column(nullable = false)
    private int pickupFloor;

    @Column(nullable = false)
    private int deliveryFloor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_type_id")
    private VehicleType vehicleType;

    @ManyToMany
    @JoinTable(
            name = "order_services",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "extra_service_id"))
    private Set<ExtraService> extraServices = new HashSet<>();

    @Column(length = 1000)
    private String note;

    /** Giá hệ thống tính khi khách đặt. */
    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal estimatedPrice;

    /** Giá nhân viên chốt khi xác nhận đơn. */
    @Column(precision = 12, scale = 0)
    private BigDecimal finalPrice;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    /** Xe được phân công. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    /** Đội vận chuyển được phân công. */
    @ManyToMany
    @JoinTable(
            name = "order_workers",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "worker_id"))
    private Set<Worker> workers = new HashSet<>();

    @Column(length = 500)
    private String cancelReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
