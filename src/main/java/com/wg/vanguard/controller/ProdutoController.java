package com.wg.vanguard.controller;

import com.wg.vanguard.model.Produto;
import com.wg.vanguard.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/produtos")

public class ProdutoController {
    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<?> salvar (@RequestBody ProdutoRequest request){
        try {
            Produto produto = produtoService.salvarProduto(request.nome(), request.tipo(),
                    request.idFornecedor());
            return ResponseEntity.status(HttpStatus.CREATED).body(produto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable long id) {
        try {
            return ResponseEntity.ok(produtoService.buscarProduto(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable long id, @RequestBody ProdutoRequest request) {
        try {
            Produto produto = produtoService.atualizarProduto(id, request.nome(),
                    request.tipo(), request.idFornecedor());
            return ResponseEntity.ok(produto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        try {
            produtoService.deletarProduto(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    public record ProdutoRequest(String nome, String tipo, long idFornecedor) {}
}
