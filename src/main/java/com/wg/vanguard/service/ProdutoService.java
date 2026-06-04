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

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produto.setNome(produtoAtualizado.getNome());
        produto.setPreco(produtoAtualizado.getPreco());
        produto.setCategoria(produtoAtualizado.getCategoria());
        produto.setTamanho(produtoAtualizado.getTamanho());
        produto.setFornecedor(produtoAtualizado.getFornecedor());
        produto.setQuantidade(produtoAtualizado.getQuantidade());

        return produtoRepository.save(produto);
    }

    public void deletar(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado");
        }
        produtoRepository.deleteById(id);
    }

    public Optional<Produto> findById(Long id) {
        return produtoRepository.findById(id);
    }
}