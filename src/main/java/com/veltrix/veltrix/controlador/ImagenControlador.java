package com.veltrix.veltrix.controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/imagenes")
public class ImagenControlador {

    private static final String CARPETA_IMAGENES = "imagenes/";

    @PostMapping("/subir")
    public ResponseEntity<Map<String, String>> subir(@RequestParam("archivo") MultipartFile archivo) {
        try {
            // Crear nombre único
            String extension = archivo.getOriginalFilename().substring(archivo.getOriginalFilename().lastIndexOf("."));
            String nombreUnico = UUID.randomUUID().toString() + extension;

            // Guardar archivo
            Path ruta = Paths.get(CARPETA_IMAGENES + nombreUnico);
            Files.createDirectories(ruta.getParent());
            archivo.transferTo(ruta.toFile());

            // Devolver URL
            String url = "/imagenes/" + nombreUnico;
            return ResponseEntity.ok(Map.of("url", url));

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al subir la imagen"));
        }
    }
}