package com.wg.vanguard.service;

import com.wg.vanguard.model.Funcionario;
import com.wg.vanguard.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Funcionario salvar(Funcionario funcionario) {
        return funcionarioRepository.save(funcionario);
    }

    public void deletar (Long id) {
        funcionarioRepository.deleteById(id);
    }

    public Funcionario atualizar(Long id, Funcionario funcionario) {
        if (funcionarioRepository.existsById(id)) {
            funcionario.setId(id);
            return funcionarioRepository.save(funcionario);
        } else {
            throw new RuntimeException("Funcionário não encontrado");
        }
    }

    public Optional<Funcionario> findById(Long id) {
        return funcionarioRepository.findById(id);
    }
}
