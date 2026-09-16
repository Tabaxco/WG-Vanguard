package com.wg.vanguard.controller;

import com.wg.vanguard.model.Fornecedor;
import com.wg.vanguard.service.FornecedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {
    @Autowired
    private FornecedorService fornecedorService;

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody FornecedorRequest request) {
        try {
            Fornecedor fornecedor = fornecedorService.salvarFornecedor(request.nome(),
                    request.telefone(), request.email(), request.cnpj());
            return ResponseEntity.status(HttpStatus.CREATED).body(fornecedor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable long id) {
        try {
            return ResponseEntity.ok(fornecedorService.buscarFornecedor(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/cpnj/{cnpj}")
    public ResponseEntity<?> buscar(@PathVariable String cnpj) {
        try {
            return ResponseEntity.ok(fornecedorService.buscarFornecedor(cnpj));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable long id, @RequestBody FornecedorRequest request) {
        try {
            Fornecedor fornecedor = fornecedorService.atualizarFornecedor(id,
                    request.nome(), request.telefone(), request.email());
            return ResponseEntity.ok(fornecedor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/cnpj/{cnpj}")
    public ResponseEntity<?> atualizar(@PathVariable String cnpj, @RequestBody FornecedorRequest request) {
        try {
            Fornecedor fornecedor = fornecedorService.atualizarFornecedor(cnpj,
                    request.nome(), request.telefone(), request.email());
            return ResponseEntity.ok(fornecedor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        try {
            fornecedorService.deletarFornecedor(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/cnpj/{cnpj}")
    public ResponseEntity<?> deletar(@PathVariable String cnpj) {
        try {
            fornecedorService.deletarFornecedor(cnpj);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    public record FornecedorRequest(String cnpj, String nome, String telefone, String email) {}
}
