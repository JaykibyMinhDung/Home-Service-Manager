package com.movingservice.catalog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {

    List<VehicleType> findAllByOrderByCapacityKgAscIdAsc();

    List<VehicleType> findByActiveTrueOrderByCapacityKgAscIdAsc();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
