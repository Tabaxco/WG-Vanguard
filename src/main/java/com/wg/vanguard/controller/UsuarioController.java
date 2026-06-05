package com.wg.vanguard.controller;

import com.wg.vanguard.dto.LoginRequest;
import com.wg.vanguard.model.Usuario;
import com.wg.vanguard.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Usuario usuario = usuarioService.login(request);
            return ResponseEntity.ok(Map.of(
                    "id",   usuario.getId(),
                    "nome", usuario.getNome(),
                    "email", usuario.getEmail()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.salvar(usuario));
    }
}