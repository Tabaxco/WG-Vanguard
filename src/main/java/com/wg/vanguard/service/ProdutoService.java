package com.wg.vanguard.service;

import com.wg.vanguard.model.Produto;
import com.wg.vanguard.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public void deletar (Long id) {
        if(!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado");
        }
        produtoRepository.deleteById(id);
    }

    public Produto atualizar(Long id, Produto produto ) {
        if (produtoRepository.existsById(id)) {
            produto.setId(id);
            return produtoRepository.save(produto);
        } else {
            throw new RuntimeException("Produto não encontrado");
        }
    }

    public Optional<Produto> findById(Long id) {
        return produtoRepository.findById(id);
    }
}
