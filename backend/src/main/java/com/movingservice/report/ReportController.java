package com.movingservice.report;

import com.movingservice.common.ApiResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue")
    public ApiResponse<List<ReportService.MonthlyRevenue>> revenue(@RequestParam int year) {
        return ApiResponse.ok(reportService.revenue(year));
    }

    @GetMapping("/orders-by-status")
    public ApiResponse<List<ReportService.StatusCount>> ordersByStatus(@RequestParam int year) {
        return ApiResponse.ok(reportService.ordersByStatus(year));
    }
}
