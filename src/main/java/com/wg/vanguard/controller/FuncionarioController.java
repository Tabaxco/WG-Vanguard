package com.wg.vanguard.controller;

import com.wg.vanguard.model.Funcionario;
import com.wg.vanguard.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {
    @Autowired
    private FuncionarioService funcionarioService;

    @PostMapping
    public Funcionario salvar(@RequestBody Funcionario funcionario) {
        return funcionarioService.salvar(funcionario);
    }

    @PutMapping("/{id}")
    public Funcionario atualizar (@PathVariable long id, @RequestBody Funcionario funcionario) {
        return funcionarioService.atualizar(id, funcionario);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable long id) {
        funcionarioService.deletar(id);
    }

    @GetMapping("/{id}")
    public Optional<Funcionario> findById(@PathVariable long id) {
        return funcionarioService.findById(id);
    }
}
