package com.wg.vanguard.service;

import com.wg.vanguard.model.Funcionario;
import com.wg.vanguard.repository.FuncionarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class FuncionarioService {
    @Autowired
    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public Funcionario salvarFuncionario(String cpf, String nome, String telefone, String email,
                                         LocalDate dataContratacao) {
        Optional<Funcionario> existente = funcionarioRepository.findByCpf(cpf);

        if (existente.isPresent()) {
            throw new RuntimeException("Funcionário já cadastrado.");
        }

        Funcionario novoFuncionario = new Funcionario();
        novoFuncionario.setCpf(cpf);
        novoFuncionario.setNome(nome);
        novoFuncionario.setTelefone(telefone);
        novoFuncionario.setEmail(email);
        novoFuncionario.setDataContratacao(dataContratacao);

        return funcionarioRepository.save(novoFuncionario);
    }

    public Funcionario buscarFuncionario(String cpf) {
        return funcionarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
    }

    public Funcionario buscarFuncionario(long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
    }

    @Transactional
    public void deletarFuncionario(long id) {
        if(!funcionarioRepository.existsById(id)) {
            throw new RuntimeException("Funcionário não encontrado");
        }
        funcionarioRepository.deleteById(id);
    }

    @Transactional
    public void deletarFuncionario(String cpf) {
        if(!funcionarioRepository.existsByCpf(cpf)) {
            throw new RuntimeException("Funcionário não encontrado");
        }
        funcionarioRepository.deleteByCpf(cpf);
    }


    @Transactional
    public Funcionario atualizarFuncionario(long id, String nome, String telefone, String email) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado."));

        funcionario.setNome(nome);
        funcionario.setEmail(email);
        funcionario.setTelefone(telefone);

        return funcionarioRepository.save(funcionario);
    }

    @Transactional
    public Funcionario atualizarFuncionario(String cpf, String nome, String telefone, String email) {
        Funcionario funcionario = funcionarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

        funcionario.setNome(nome);
        funcionario.setEmail(email);
        funcionario.setTelefone(telefone);

        return funcionarioRepository.save(funcionario);
    }
}
