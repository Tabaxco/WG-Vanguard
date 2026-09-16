package com.wg.vanguard.service;

import com.wg.vanguard.model.Cliente;
import com.wg.vanguard.model.Pedido;
import com.wg.vanguard.repository.ClienteRepository;
import com.wg.vanguard.repository.PedidoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class PedidoService {
    @Autowired
    private final ClienteRepository clienteRepository;
    @Autowired
    private final PedidoRepository pedidoRepository;

    public PedidoService(ClienteRepository clienteRepository,
                         PedidoRepository pedidoRepository) {
        this.clienteRepository = clienteRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional
    public Pedido salvarPedido(long idCliente, String status,
                               LocalDate dataPedido, BigDecimal valorTotal) {

        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataPedido(dataPedido);
        pedido.setValorTotal(valorTotal);
        pedido.setStatus(status);

        return pedidoRepository.save(pedido);
    }

    public Pedido buscarPedido(long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não existe"));
    }

    public void deletarPedido(long id) {
        if(!pedidoRepository.existsById(id)) {
            throw new RuntimeException("Pedido não existe");
        }
        pedidoRepository.deleteById(id);
    }

    public Pedido atualizarPedido(long id, String status,
                                  LocalDate dataPedido, BigDecimal valorTotal) {

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não existe"));

        pedido.setStatus(status);
        pedido.setValorTotal(valorTotal);
        pedido.setDataPedido(dataPedido);

        return pedidoRepository.save(pedido);
    }
}
