package com.movingservice.catalog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExtraServiceRepository extends JpaRepository<ExtraService, Long> {

    List<ExtraService> findAllByOrderByIdAsc();

    List<ExtraService> findByActiveTrueOrderByIdAsc();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
