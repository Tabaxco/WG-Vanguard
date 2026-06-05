package com.wg.vanguard.service;

import com.wg.vanguard.model.Cliente;
import com.wg.vanguard.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }


    public Cliente buscarOuCriarCliente(String cpf, String nome, String telefone) {
        Optional<Cliente> existente = clienteRepository.findByCpf(cpf);

        if (existente.isPresent()) {
            return existente.get();
        }

        Cliente novo = new Cliente();
        novo.setCpf(cpf);
        novo.setNome(nome);
        novo.setTelefone(telefone);
        return clienteRepository.save(novo);
    }

    public Cliente buscarPorCpf(String cpf) {
        return clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + cpf));
    }

    public Cliente salvarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
}