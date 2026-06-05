package com.wg.vanguard.controller;

import com.wg.vanguard.model.Cliente;
import com.wg.vanguard.service.ClienteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public Cliente salvarCliente(@RequestBody Cliente cliente) {
        return clienteService.salvarCliente(cliente);
    }

    @GetMapping("/cpf/{cpf}")
    public Cliente buscarPorCpf(@PathVariable String cpf) {
        return clienteService.buscarPorCpf(cpf);
    }
}