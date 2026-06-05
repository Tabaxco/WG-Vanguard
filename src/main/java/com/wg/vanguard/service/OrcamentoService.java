package com.wg.vanguard.service;

import com.wg.vanguard.dto.OrcamentoRequest;
import com.wg.vanguard.model.Cliente;
import com.wg.vanguard.model.Orcamento;
import com.wg.vanguard.repository.OrcamentoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrcamentoService {

    private final OrcamentoRepository orcamentoRepository;
    private final ClienteService clienteService;

    public OrcamentoService(OrcamentoRepository orcamentoRepository,
                            ClienteService clienteService) {
        this.orcamentoRepository = orcamentoRepository;
        this.clienteService = clienteService;
    }

    public Orcamento criarOrcamento(OrcamentoRequest request) {

        // Upsert de cliente: busca pelo CPF; se não existir, cadastra
        Cliente cliente = clienteService.buscarOuCriarCliente(
                request.getCpf(),
                request.getNomeCliente(),
                request.getTelefone()
        );

        Orcamento orcamento = new Orcamento();
        orcamento.setCliente(cliente);
        orcamento.setValorTotal(request.getValorComDesconto()); // já com desconto
        orcamento.setDataOrcamento(
                request.getDataOrcamento() != null
                        ? request.getDataOrcamento()
                        : LocalDate.now()
        );
        orcamento.setStatus(request.getStatus());
        orcamento.setObservacoes(request.getObservacoes());
        orcamento.setDesconto(request.getDesconto());
        orcamento.setItens(request.getItens());

        return orcamentoRepository.save(orcamento);
    }


    public Orcamento editarOrcamento(Long id, OrcamentoRequest request) {
        Orcamento orcamento = buscarPorId(id);

        Cliente cliente = clienteService.buscarOuCriarCliente(
                request.getCpf(),
                request.getNomeCliente(),
                request.getTelefone()
        );

        orcamento.setCliente(cliente);
        orcamento.setValorTotal(request.getValorComDesconto());
        orcamento.setStatus(request.getStatus());
        orcamento.setObservacoes(request.getObservacoes());
        orcamento.setDesconto(request.getDesconto());
        orcamento.setItens(request.getItens());
        if (request.getDataOrcamento() != null) {
            orcamento.setDataOrcamento(request.getDataOrcamento());
        }

        return orcamentoRepository.save(orcamento);
    }

    public Orcamento buscarPorId(Long id) {
        return orcamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado: " + id));
    }

    public List<Orcamento> buscarPorCpfCliente(String cpf) {
        return orcamentoRepository.findByClienteCpf(cpf);
    }

    public void deletarOrcamento(Long id) {
        Orcamento orcamento = buscarPorId(id);
        orcamentoRepository.delete(orcamento);
    }
}