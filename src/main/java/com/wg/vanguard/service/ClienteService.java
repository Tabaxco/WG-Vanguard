package com.wg.vanguard.service;

import com.wg.vanguard.model.Cliente;
import com.wg.vanguard.repository.ClienteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClienteService {
    @Autowired
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente salvarCliente(String cpf, String nome, String telefone, String email) {
        Optional<Cliente> existente = clienteRepository.findByCpf(cpf);

        if (existente.isPresent()) {
            throw new RuntimeException("Cliente já cadastrado.");
        }

        Cliente novoCliente = new Cliente();
        novoCliente.setCpf(cpf);
        novoCliente.setNome(nome);
        novoCliente.setTelefone(telefone);
        novoCliente.setEmail(email);
        return clienteRepository.save(novoCliente);
    }

    public Cliente buscarCliente(String cpf) {
        return clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
    }

    public Cliente buscarCliente(long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
    }

    @Transactional
    public void deletarCliente(String cpf) {
        if(!clienteRepository.existsByCpf(cpf)) {
            throw new RuntimeException("Cliente não existe");
        }
        clienteRepository.deleteByCpf(cpf);
    }

    @Transactional
    public void deletarCliente(long id) {
        if(!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente não existe");
        }
        clienteRepository.deleteById(id);
    }

    @Transactional
    public Cliente atualizarCliente(String cpf, String nome, String telefone, String email) {
        Cliente cliente = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        cliente.setNome(nome);
        cliente.setTelefone(telefone);
        cliente.setEmail(email);

        return clienteRepository.save(cliente);
    }

    @Transactional
    public Cliente atualizarCliente(long id, String nome, String telefone, String email) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        cliente.setNome(nome);
        cliente.setEmail(email);
        cliente.setTelefone(telefone);

        return clienteRepository.save(cliente);
    }
}
