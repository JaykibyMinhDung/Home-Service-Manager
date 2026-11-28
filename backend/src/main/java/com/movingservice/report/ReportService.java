package com.movingservice.report;

import com.movingservice.common.ApiException;
import com.movingservice.order.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public record MonthlyRevenue(int month, BigDecimal revenue, long orderCount) {
    }

    public record StatusCount(Order.Status status, long count) {
    }

    @Transactional(readOnly = true)
    public List<MonthlyRevenue> revenue(int year) {
        checkYear(year);
        Map<Integer, Object[]> rows = new HashMap<>();
        for (Object[] row : reportRepository.sumByMonth(Order.Status.COMPLETED, startOf(year), startOf(year + 1))) {
            rows.put(((Number) row[0]).intValue(), row);
        }
        List<MonthlyRevenue> result = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            Object[] row = rows.get(month);
            BigDecimal revenue = row == null || row[1] == null ? BigDecimal.ZERO : (BigDecimal) row[1];
            long count = row == null ? 0 : ((Number) row[2]).longValue();
            result.add(new MonthlyRevenue(month, revenue, count));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<StatusCount> ordersByStatus(int year) {
        checkYear(year);
        Map<Order.Status, Long> counts = new HashMap<>();
        for (Object[] row : reportRepository.countByStatus(startOf(year), startOf(year + 1))) {
            counts.put((Order.Status) row[0], ((Number) row[1]).longValue());
        }
        return Arrays.stream(Order.Status.values())
                .map(status -> new StatusCount(status, counts.getOrDefault(status, 0L)))
                .toList();
    }

    private void checkYear(int year) {
        if (year < 2000 || year > 2100) {
            throw ApiException.badRequest("Năm không hợp lệ");
        }
    }

    private LocalDateTime startOf(int year) {
        return LocalDateTime.of(year, 1, 1, 0, 0);
    }
}
