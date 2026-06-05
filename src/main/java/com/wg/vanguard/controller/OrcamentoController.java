package com.wg.vanguard.controller;

import com.wg.vanguard.model.Orcamento;
import com.wg.vanguard.dto.OrcamentoRequest;
import com.wg.vanguard.service.OrcamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orcamentos")
@CrossOrigin(origins = "*")
public class OrcamentoController {

    private final OrcamentoService orcamentoService;

    public OrcamentoController(OrcamentoService orcamentoService) {
        this.orcamentoService = orcamentoService;
    }

    @PostMapping
    public ResponseEntity<Orcamento> criar(@RequestBody OrcamentoRequest request) {
        return ResponseEntity.ok(orcamentoService.criarOrcamento(request));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Orcamento> editar(@PathVariable Long id,
                                            @RequestBody OrcamentoRequest request) {
        return ResponseEntity.ok(orcamentoService.editarOrcamento(id, request));
    }


    @GetMapping("/{id}")
    public ResponseEntity<Orcamento> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(orcamentoService.buscarPorId(id));
    }


    @GetMapping("/cliente/{cpf}")
    public ResponseEntity<List<Orcamento>> buscarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(orcamentoService.buscarPorCpfCliente(cpf));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        orcamentoService.deletarOrcamento(id);
        return ResponseEntity.noContent().build();
    }
}