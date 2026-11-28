package com.movingservice.fleet;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @EntityGraph(attributePaths = "vehicleType")
    List<Vehicle> findAllByOrderByIdAsc();

    boolean existsByLicensePlateIgnoreCase(String licensePlate);

    boolean existsByLicensePlateIgnoreCaseAndIdNot(String licensePlate, Long id);
}
