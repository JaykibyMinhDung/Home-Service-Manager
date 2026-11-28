package com.movingservice.catalog;

import com.movingservice.common.ApiResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/vehicle-types")
    public ApiResponse<List<VehicleTypeResponse>> vehicleTypes(
            @RequestParam(defaultValue = "false") boolean includeInactive, Authentication authentication) {
        return ApiResponse.ok(catalogService.listVehicleTypes(includeInactive && isAdmin(authentication)).stream()
                .map(VehicleTypeResponse::from)
                .toList());
    }

    @GetMapping("/extra-services")
    public ApiResponse<List<ExtraServiceResponse>> extraServices(
            @RequestParam(defaultValue = "false") boolean includeInactive, Authentication authentication) {
        return ApiResponse.ok(catalogService.listExtraServices(includeInactive && isAdmin(authentication)).stream()
                .map(ExtraServiceResponse::from)
                .toList());
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null
                && authentication.getAuthorities().stream()
                        .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }
}
