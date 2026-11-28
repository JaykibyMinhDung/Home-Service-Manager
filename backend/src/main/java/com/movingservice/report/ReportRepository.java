package com.movingservice.report;

import com.movingservice.order.Order;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends Repository<Order, Long> {

    @Query("""
            select extract(month from o.movingTime), sum(o.finalPrice), count(o)
            from Order o
            where o.status = :status and o.movingTime >= :from and o.movingTime < :to
            group by extract(month from o.movingTime)
            """)
    List<Object[]> sumByMonth(
            @Param("status") Order.Status status,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query("""
            select o.status, count(o)
            from Order o
            where o.movingTime >= :from and o.movingTime < :to
            group by o.status
            """)
    List<Object[]> countByStatus(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
