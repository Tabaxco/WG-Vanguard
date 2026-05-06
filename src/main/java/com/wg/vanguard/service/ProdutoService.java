package com.wg.vanguard.service;

import com.wg.vanguard.model.Produto;
import com.wg.vanguard.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;
}
