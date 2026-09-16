package com.wg.vanguard.service;

import com.wg.vanguard.model.Fornecedor;
import com.wg.vanguard.model.Produto;
import com.wg.vanguard.repository.FornecedorRepository;
import com.wg.vanguard.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProdutoService {
    @Autowired
    private final ProdutoRepository produtoRepository;

    @Autowired
    private final FornecedorRepository fornecedorRepository;

    public ProdutoService (ProdutoRepository produtoRepository, FornecedorRepository fornecedorRepository) {
        this.produtoRepository = produtoRepository;
        this.fornecedorRepository = fornecedorRepository;
    }

    public Produto salvarProduto(String nome, String tipo, long idFornecedor) {
        Fornecedor fornecedor = fornecedorRepository.findById(idFornecedor)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado."));

        Produto novoProduto = new Produto();
        novoProduto.setNome(nome);
        novoProduto.setTipo(tipo);
        novoProduto.setFornecedor(fornecedor);

        return produtoRepository.save(novoProduto);
    }

    public Produto buscarProduto(long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    @Transactional
    public void deletarProduto(long id) {
        if(!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não existe");
        }
        produtoRepository.deleteById(id);
    }

    @Transactional
    public Produto atualizarProduto(long id, String nome, String tipo, long idFornecedor) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não existe"));

        Fornecedor fornecedor = fornecedorRepository.findById(idFornecedor)
                .orElseThrow(() -> new RuntimeException("Fornecedor não existe"));

        produto.setNome(nome);
        produto.setTipo(tipo);
        produto.setFornecedor(fornecedor);

        return produtoRepository.save(produto);
    }
}
