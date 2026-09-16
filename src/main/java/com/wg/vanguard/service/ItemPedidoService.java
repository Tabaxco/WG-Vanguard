package com.wg.vanguard.service;

import com.wg.vanguard.model.ItemPedido;
import com.wg.vanguard.model.Pedido;
import com.wg.vanguard.model.Produto;
import com.wg.vanguard.repository.ItemPedidoRepository;
import com.wg.vanguard.repository.PedidoRepository;
import com.wg.vanguard.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ItemPedidoService {
    @Autowired
    private final ItemPedidoRepository itemPedidoRepository;
    @Autowired
    private final PedidoRepository pedidoRepository;
    @Autowired
    private final ProdutoRepository produtoRepository;

    public ItemPedidoService(ItemPedidoRepository itemPedidoRepository,
                             PedidoRepository pedidoRepository,
                             ProdutoRepository produtoRepository) {
        this.itemPedidoRepository = itemPedidoRepository;
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public ItemPedido salvarItemPedido(long idProduto, long idPedido, int quantidade,
                                       BigDecimal precoUnitario) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        ItemPedido itemPedido = new ItemPedido();
        itemPedido.setProduto(produto);
        itemPedido.setPedido(pedido);
        itemPedido.setQuantidade(quantidade);
        itemPedido.setPrecoUnitario(precoUnitario);

        return itemPedidoRepository.save(itemPedido);
    }

    public ItemPedido buscarItemPedido(long id) {
        return itemPedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));
    }

    @Transactional
    public void deletarItemPedido(long id) {
        if(!itemPedidoRepository.existsById(id)) {
            throw new RuntimeException("Item não existe");
        }
        itemPedidoRepository.deleteById(id);
    }

    @Transactional
    public ItemPedido atualizarItemPedido(long id, int quantidade, BigDecimal precoUnitario) {
        ItemPedido itemPedido = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não existe"));

        itemPedido.setQuantidade(quantidade);
        itemPedido.setPrecoUnitario(precoUnitario);

        return itemPedidoRepository.save(itemPedido);
    }

}
