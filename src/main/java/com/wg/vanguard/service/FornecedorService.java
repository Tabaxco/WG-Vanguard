package com.wg.vanguard.service;

import com.wg.vanguard.model.Fornecedor;
import com.wg.vanguard.repository.FornecedorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FornecedorService {
    @Autowired
    private final FornecedorRepository fornecedorRepository;

    public FornecedorService (FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    public Fornecedor salvarFornecedor(String nome, String telefone, String email, String cnpj) {
        Optional<Fornecedor> existente = fornecedorRepository.findByCnpj(cnpj);

        if(existente.isPresent()) {
            throw new RuntimeException("Empresa já cadastrada");
        }

        Fornecedor novoFornecedor = new Fornecedor();
        novoFornecedor.setNome(nome);
        novoFornecedor.setTelefone(telefone);
        novoFornecedor.setEmail(email);
        novoFornecedor.setCnpj(cnpj);

        return fornecedorRepository.save(novoFornecedor);
    }

    public Fornecedor buscarFornecedor(long id) {
        return fornecedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));
    }

    public Fornecedor buscarFornecedor(String cnpj) {
        return fornecedorRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));
    }

    @Transactional
    public void deletarFornecedor(long id) {
        if(!fornecedorRepository.existsById(id)) {
            throw new RuntimeException("Fornecedor não existe");
        }
        fornecedorRepository.deleteById(id);
    }

    @Transactional
    public void deletarFornecedor(String cnpj) {
        if(!fornecedorRepository.existsByCnpj(cnpj)) {
            throw new RuntimeException("Fornecedor não existe");
        }
        fornecedorRepository.deleteByCnpj(cnpj);
    }

    @Transactional
    public Fornecedor atualizarFornecedor(String cnpj, String nome, String telefone, String email) {
        Fornecedor fornecedor = fornecedorRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado."));

        fornecedor.setNome(nome);
        fornecedor.setTelefone(telefone);
        fornecedor.setEmail(email);

        return fornecedorRepository.save(fornecedor);
    }

    @Transactional
    public Fornecedor atualizarFornecedor(long id, String nome, String telefone, String email) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado."));

        fornecedor.setNome(nome);
        fornecedor.setEmail(email);
        fornecedor.setTelefone(telefone);

        return fornecedorRepository.save(fornecedor);
    }

    public List<Fornecedor> listarFornecedores() {
        return fornecedorRepository.findAll();
    }
}
