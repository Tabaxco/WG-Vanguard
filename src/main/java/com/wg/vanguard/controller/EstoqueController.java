package com.wg.vanguard.controller;

import com.wg.vanguard.model.Estoque;
import com.wg.vanguard.service.EstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/estoque")
public class EstoqueController {
    @Autowired
    private EstoqueService estoqueService;

    @PostMapping
    public Estoque salvar(@RequestBody Estoque estoque) {
        return estoqueService.salvar(estoque);
    }

    @PutMapping("/{id}")
    public Estoque atualizar (@PathVariable long id, @RequestBody Estoque estoque) {
        return estoqueService.atualizar(id, estoque);
    }

    @DeleteMapping("/{id}")
    public void deletar (@PathVariable long id) {
        estoqueService.deletar(id);
    }

    @GetMapping("/{id}")
    public Optional<Estoque> findById(@PathVariable long id) {
        return estoqueService.findById(id);
    }
}
