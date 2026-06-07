package com.horizonte.repository;

import com.horizonte.entity.AreaComun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AreaComunRepository
        extends JpaRepository<AreaComun, Long> {

    List<AreaComun> findByActivoTrue();

    Long countByActivoTrue();
}