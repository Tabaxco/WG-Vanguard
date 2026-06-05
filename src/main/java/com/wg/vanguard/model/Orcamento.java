package com.wg.vanguard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataOrcamento;

    private String observacoes;

    private double valorTotal;


    private double desconto;


    @Column(columnDefinition = "TEXT")
    private String itens;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;



    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDataOrcamento() { return dataOrcamento; }
    public void setDataOrcamento(LocalDate dataOrcamento) { this.dataOrcamento = dataOrcamento; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public double getValorTotal() { return valorTotal; }
    public void setValorTotal(double valorTotal) { this.valorTotal = valorTotal; }

    public double getDesconto() { return desconto; }
    public void setDesconto(double desconto) { this.desconto = desconto; }

    public String getItens() { return itens; }


    public void setItens(Object itens) {
        if (itens == null) { this.itens = "[]"; return; }
        if (itens instanceof String) { this.itens = (String) itens; return; }
        try {
            this.itens = new com.fasterxml.jackson.databind.ObjectMapper()
                    .writeValueAsString(itens);
        } catch (Exception e) {
            this.itens = "[]";
        }
    }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}