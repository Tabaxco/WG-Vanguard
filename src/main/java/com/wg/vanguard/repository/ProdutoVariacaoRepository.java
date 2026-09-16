package com.wg.vanguard.repository;

import com.wg.vanguard.model.ProdutoVariacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProdutoVariacaoRepository extends JpaRepository<ProdutoVariacao, Long> {
    List<ProdutoVariacao> findByEstoqueLessThanEqual(long limite);
}
