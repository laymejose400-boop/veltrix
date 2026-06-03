package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.entidad.Contacto;
import com.veltrix.veltrix.repositorio.ContactoRepositorio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contactos")
public class ContactoControlador {

    private final ContactoRepositorio contactoRepositorio;

    public ContactoControlador(ContactoRepositorio contactoRepositorio) {
        this.contactoRepositorio = contactoRepositorio;
    }

    // POST /api/contactos → público (enviar mensaje)
    @PostMapping
    public ResponseEntity<Map<String, String>> enviar(@RequestBody Contacto contacto) {
        contactoRepositorio.save(contacto);
        return ResponseEntity.ok(Map.of("mensaje", "Mensaje enviado correctamente"));
    }

    // GET /api/contactos → admin (ver mensajes)
    @GetMapping
    public List<Contacto> listar() {
        return contactoRepositorio.findAllByOrderByCreadoEnDesc();
    }
}