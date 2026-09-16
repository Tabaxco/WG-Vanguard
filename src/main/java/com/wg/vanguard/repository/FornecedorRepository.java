package com.wg.vanguard.repository;

import com.wg.vanguard.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {
    Optional<Fornecedor> findByCnpj(String cnpj);
    boolean existsByCnpj (String cnpj);
    void deleteByCnpj (String cnpj);
}
