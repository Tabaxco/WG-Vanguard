package com.wg.vanguard.controller;

import com.wg.vanguard.model.Funcionario;
import com.wg.vanguard.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {
    @Autowired
    private FuncionarioService funcionarioService;

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody FuncionarioRequest request) {
        try {
            Funcionario funcionario = funcionarioService.salvarFuncionario(request.nome(),
                    request.email(), request.telefone(), request.cpf(), request.dataContratacao());
            return ResponseEntity.status(HttpStatus.CREATED).body(funcionario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar (@PathVariable long id) {
        try{
            return ResponseEntity.ok(funcionarioService.buscarFuncionario(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("cpf/{cpf}")
    public ResponseEntity<?> buscar (@PathVariable String cpf) {
        try {
            return ResponseEntity.ok(funcionarioService.buscarFuncionario(cpf));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable long id, @RequestBody FuncionarioRequest request) {
        try {
            Funcionario funcionario = funcionarioService.atualizarFuncionario(id, request.nome(),
                    request.telefone(), request.email());

            return ResponseEntity.ok(funcionario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/cpf/{cpf}")
    public ResponseEntity<?> atualizar(@PathVariable String cpf, @RequestBody FuncionarioRequest request) {
        try {
            Funcionario funcionario = funcionarioService.atualizarFuncionario(cpf, request.nome(),
                    request.telefone(), request.email());
            return ResponseEntity.ok(funcionario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        try {
            funcionarioService.deletarFuncionario(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/cpf/{cpf}")
    public ResponseEntity<?> deletar(@PathVariable String cpf) {
        try {
            funcionarioService.deletarFuncionario(cpf);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    public record FuncionarioRequest(String nome, String telefone, String email, String cpf, LocalDate dataContratacao) { }
}
