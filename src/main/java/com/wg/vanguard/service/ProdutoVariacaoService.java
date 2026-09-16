package com.wg.vanguard.service;

import com.wg.vanguard.model.Produto;
import com.wg.vanguard.model.ProdutoVariacao;
import com.wg.vanguard.repository.ProdutoRepository;
import com.wg.vanguard.repository.ProdutoVariacaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProdutoVariacaoService {
    @Autowired
    private final ProdutoVariacaoRepository produtoVariacaoRepository;

    @Autowired
    private final ProdutoRepository produtoRepository;

    public ProdutoVariacaoService (ProdutoVariacaoRepository produtoVariacaoRepository,
                                   ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
        this.produtoVariacaoRepository = produtoVariacaoRepository;
    }

    @Transactional
    public ProdutoVariacao salvarVariacao(long idProduto, String cor,
                                          String tamanho, BigDecimal valorTotal) {

        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        ProdutoVariacao produtoVariacao = new ProdutoVariacao();
        produtoVariacao.setProduto(produto);
        produtoVariacao.setCor(cor);
        produtoVariacao.setTamanho(tamanho);
        produtoVariacao.setValorTotal(valorTotal);

        return produtoVariacaoRepository.save(produtoVariacao);
    }


    @Transactional
    public ProdutoVariacao salvarVariacao(long idProduto, String cor,
                                          String tamanho, BigDecimal valorTotal, long estoque) {

        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        ProdutoVariacao produtoVariacao = new ProdutoVariacao();
        produtoVariacao.setProduto(produto);
        produtoVariacao.setCor(cor);
        produtoVariacao.setTamanho(tamanho);
        produtoVariacao.setValorTotal(valorTotal);
        produtoVariacao.setEstoque(estoque);

        return produtoVariacaoRepository.save(produtoVariacao);
    }

    public ProdutoVariacao buscarVariacao(long id) {
        return produtoVariacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
    }

    @Transactional
    public void deletarVariacao(long id) {
        if(!produtoVariacaoRepository.existsById(id)) {
            throw new RuntimeException("Variação não existe.");
        }
        produtoVariacaoRepository.deleteById(id);
    }

    @Transactional
    public ProdutoVariacao atualizarVariacao(long id, String cor,
                                             String tamanho, BigDecimal valorTotal, long estoque) {

        ProdutoVariacao produtoVariacao = produtoVariacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variação não encontrada"));

        produtoVariacao.setCor(cor);
        produtoVariacao.setTamanho(tamanho);
        produtoVariacao.setValorTotal(valorTotal);
        produtoVariacao.setEstoque(estoque);

        return produtoVariacaoRepository.save(produtoVariacao);
    }

    public List<ProdutoVariacao> buscarComEstoqueBaixo(long limite) {
        return produtoVariacaoRepository.findByEstoqueLessThanEqual(limite);
    }
}
