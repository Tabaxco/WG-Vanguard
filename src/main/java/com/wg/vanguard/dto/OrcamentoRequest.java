package com.wg.vanguard.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.List;


public class OrcamentoRequest {

    private String cpf;
    private String nomeCliente;
    private String telefone;

    private String status;
    private String observacoes;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataOrcamento;

    private double subtotal;   // soma bruta dos itens
    private double desconto;   // percentual (0–100)

    private List<ItemOrcamento> itens;


    public double getValorComDesconto() {
        double pct = Math.min(100, Math.max(0, desconto));
        return subtotal * (1 - pct / 100.0);
    }



    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNomeCliente() { return nomeCliente; }
    public void setNomeCliente(String nomeCliente) { this.nomeCliente = nomeCliente; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public LocalDate getDataOrcamento() { return dataOrcamento; }
    public void setDataOrcamento(LocalDate dataOrcamento) { this.dataOrcamento = dataOrcamento; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getDesconto() { return desconto; }
    public void setDesconto(double desconto) { this.desconto = desconto; }

    public List<ItemOrcamento> getItens() { return itens; }
    public void setItens(List<ItemOrcamento> itens) { this.itens = itens; }



    public static class ItemOrcamento {
        private String peca;
        private String categoria;
        private String cor;
        private String tamanho;
        private int quantidade;
        private double precoUnitario;

        public String getPeca() { return peca; }
        public void setPeca(String peca) { this.peca = peca; }

        public String getCategoria() { return categoria; }
        public void setCategoria(String categoria) { this.categoria = categoria; }

        public String getCor() { return cor; }
        public void setCor(String cor) { this.cor = cor; }

        public String getTamanho() { return tamanho; }
        public void setTamanho(String tamanho) { this.tamanho = tamanho; }

        public int getQuantidade() { return quantidade; }
        public void setQuantidade(int quantidade) { this.quantidade = quantidade; }

        public double getPrecoUnitario() { return precoUnitario; }
        public void setPrecoUnitario(double precoUnitario) { this.precoUnitario = precoUnitario; }
    }
}