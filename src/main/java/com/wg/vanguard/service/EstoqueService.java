package com.wg.vanguard.service;

import com.wg.vanguard.model.Estoque;
import com.wg.vanguard.repository.EstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EstoqueService {

    @Autowired
    private EstoqueRepository estoqueRepository;

    public Estoque salvar(Estoque estoque) {
        return estoqueRepository.save(estoque);
    }

    public void deletar (Long id) {
        estoqueRepository.deleteById(id);
    }

    public Estoque atualizar (Long id, Estoque estoque) {
        if (estoqueRepository.existsById(id)) {
            estoque.setProdutoId(id);
            return estoqueRepository.save(estoque);
        } else {
            throw new RuntimeException("Produto não encontrado no estoque");
        }
    }
    public Optional<Estoque> findById(Long id) {
        return estoqueRepository.findById(id);
    }
}
