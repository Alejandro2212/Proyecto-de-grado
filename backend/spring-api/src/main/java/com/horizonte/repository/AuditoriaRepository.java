package com.horizonte.repository;

import com.horizonte.entity.Auditoria;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriaRepository
        extends JpaRepository<Auditoria, Long> {
}