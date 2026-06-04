package com.wg.vanguard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Entity
public class Estoque {

    @Id
    private long id_produto;
    private double quantidade;

    public long getId_produto() {
        return id_produto;
    }

    public void setId_produto(long id_produto) {
        this.id_produto = id_produto;
    }

    public double getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(double quantidade) {
        this.quantidade = quantidade;
    }
}
