package com.wg.vanguard.service;

import com.wg.vanguard.model.Funcionario;
import com.wg.vanguard.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;
}
