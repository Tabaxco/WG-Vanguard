package com.wg.vanguard.controller;

import com.wg.vanguard.model.ProdutoVariacao;
import com.wg.vanguard.service.ProdutoVariacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/produtosvariacao")
public class ProdutoVariacaoController {
    @Autowired
    ProdutoVariacaoService produtoVariacaoService;

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody ProdutoVariacaoRequest request) {
        try {
            ProdutoVariacao produtoVariacao = produtoVariacaoService.salvarVariacao(
                    request.idProduto(), request.cor(), request.tamanho(), request.valorTotal());
            return ResponseEntity.status(HttpStatus.CREATED).body(produtoVariacao);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable long id) {
        try {
            return ResponseEntity.ok(produtoVariacaoService.buscarVariacao(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable long id, @RequestBody ProdutoVariacaoRequest request) {
        try {
            ProdutoVariacao produtoVariacao = produtoVariacaoService.atualizarVariacao(id,
                    request.cor(), request.tamanho(), request.valorTotal(), request.estoque());
            return ResponseEntity.ok(produtoVariacao);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        try {
            produtoVariacaoService.deletarVariacao(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/estoque-baixo")
    public ResponseEntity<?> listarEstoqueBaixo(@RequestParam(defaultValue = "5") long limite) {
        return ResponseEntity.ok(produtoVariacaoService.buscarComEstoqueBaixo(limite));
    }

    public record ProdutoVariacaoRequest(long idProduto, String cor, String tamanho,
                                         BigDecimal valorTotal, long estoque){}
}
