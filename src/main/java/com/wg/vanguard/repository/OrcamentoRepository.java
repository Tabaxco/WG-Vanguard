package com.wg.vanguard.repository;

import com.wg.vanguard.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    List<Orcamento> findByClienteCpf(String cpf);
}