package com.wg.vanguard.controller;

import com.wg.vanguard.model.Produto;
import com.wg.vanguard.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {
    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public Produto salvar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }

    @PutMapping("/{id}")
    public Produto atualizar (@PathVariable long id, @RequestBody Produto produto) {
        return produtoService.atualizar(id, produto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable long id) {
        produtoService.deletar(id);
    }

    @GetMapping("/{id}")
    public Optional<Produto> findById(@PathVariable long id) {
        return produtoService.findById(id);
    }
}
