package com.wg.vanguard.service;

import com.wg.vanguard.dto.LoginRequest;
import com.wg.vanguard.model.Usuario;
import com.wg.vanguard.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!usuario.getSenha().equals(request.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        return usuario;
    }

    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}