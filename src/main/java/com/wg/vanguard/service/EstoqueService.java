package com.wg.vanguard.service;

import com.wg.vanguard.model.Estoque;
import com.wg.vanguard.repository.EstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EstoqueService {

    @Autowired
    private EstoqueRepository estoqueRepository;
}
