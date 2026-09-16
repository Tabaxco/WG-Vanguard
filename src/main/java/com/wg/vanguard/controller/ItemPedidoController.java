package com.wg.vanguard.controller;

import com.wg.vanguard.model.ItemPedido;
import com.wg.vanguard.service.ItemPedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/itempedido")
public class ItemPedidoController {
    @Autowired
    ItemPedidoService itemPedidoService;

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody ItemPedidoRequest request) {
        try {
            ItemPedido itemPedido = itemPedidoService.salvarItemPedido(request.idProduto(),
                    request.idPedido(), request.quantidade(), request.precoUnitario());
            return ResponseEntity.status(HttpStatus.CREATED).body(itemPedido);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable long id) {
        try {
            return ResponseEntity.ok(itemPedidoService.buscarItemPedido(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable long id, @RequestBody ItemPedidoRequest request) {
        try {
            ItemPedido itemPedido = itemPedidoService.atualizarItemPedido(id, request.quantidade(),
                    request.precoUnitario());
            return ResponseEntity.ok(itemPedido);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        try {
            itemPedidoService.deletarItemPedido(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

        public record ItemPedidoRequest(long idPedido, long idProduto,
                                        int quantidade, BigDecimal precoUnitario) {
        }
    }

