package com.wg.vanguard.controller;

import com.wg.vanguard.model.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.wg.vanguard.service.ClienteService;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/clientes")
public class ClienteController {
    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody ClienteRequest request) {
        try {
            Cliente cliente = clienteService.salvarCliente(
                    request.cpf(), request.nome(), request.telefone(), request.email());
            return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable long id) {
        try {
            return ResponseEntity.ok(clienteService.buscarCliente(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<?> buscar(@PathVariable String cpf) {
        try {
            return ResponseEntity.ok(clienteService.buscarCliente(cpf));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable long id, @RequestBody ClienteRequest request) {
        try {
            Cliente cliente = clienteService.atualizarCliente(id,
                    request.nome(), request.telefone(), request.email());
            return ResponseEntity.ok(cliente);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/cpf/{cpf}")
    public ResponseEntity<?> atualizar(@PathVariable String cpf, @RequestBody ClienteRequest request) {
        try{
            Cliente cliente = clienteService.atualizarCliente(cpf,
                    request.nome(), request.telefone(), request.email());
            return ResponseEntity.ok(cliente);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        try {
            clienteService.deletarCliente(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/cpf/{cpf}")
    public ResponseEntity<?> deletar(@PathVariable String cpf) {
        try {
            clienteService.deletarCliente(cpf);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    public record ClienteRequest(String cpf, String nome, String telefone, String email) {}
}


