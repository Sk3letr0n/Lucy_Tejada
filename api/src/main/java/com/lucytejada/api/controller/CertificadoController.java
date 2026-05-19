package com.lucytejada.api.controller;

import com.lucytejada.api.model.Estudiante;
import com.lucytejada.api.repository.EstudianteRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * CertificadoController — Genera certificados de matrícula en PDF.
 *
 * GET /api/certificados/estudiante/{id}  → descarga el PDF del estudiante
 *
 * Usa Apache PDFBox 3.x para construir el documento en memoria y devolverlo
 * como archivo descargable sin necesidad de guardarlo en disco.
 */
@RestController
@RequestMapping("/api/certificados")
public class CertificadoController {

    private final EstudianteRepository estudianteRepository;

    public CertificadoController(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    @GetMapping("/estudiante/{id}")
    public ResponseEntity<byte[]> generarCertificado(@PathVariable Long id) {
        return estudianteRepository.findById(id)
                .map(estudiante -> {
                    try {
                        byte[] pdf = construirPdf(estudiante);
                        String nombreArchivo = "certificado_" + id + ".pdf";

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_PDF);
                        headers.setContentDispositionFormData("attachment", nombreArchivo);

                        return ResponseEntity.ok().headers(headers).body(pdf);
                    } catch (IOException e) {
                        throw new RuntimeException("Error al generar el PDF", e);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------------------------
    // Construcción del PDF con PDFBox
    // -------------------------------------------------------------------------

    private byte[] construirPdf(Estudiante estudiante) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage pagina = new PDPage(PDRectangle.LETTER);
            doc.addPage(pagina);

            float anchoPage  = pagina.getMediaBox().getWidth();
            float altoPage   = pagina.getMediaBox().getHeight();

            PDType1Font fuenteNegrita    = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font fuenteNormal     = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font fuenteItalica    = new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE);

            try (PDPageContentStream cs = new PDPageContentStream(doc, pagina)) {

                // ── Línea decorativa superior ──────────────────────────────
                cs.setLineWidth(3);
                cs.moveTo(50, altoPage - 60);
                cs.lineTo(anchoPage - 50, altoPage - 60);
                cs.stroke();

                // ── Título ─────────────────────────────────────────────────
                String titulo = "CERTIFICADO DE MATRICULA";
                cs.setFont(fuenteNegrita, 24);
                float tituloX = centrarTexto(titulo, fuenteNegrita, 24, anchoPage);
                cs.beginText();
                cs.newLineAtOffset(tituloX, altoPage - 110);
                cs.showText(titulo);
                cs.endText();

                // ── Nombre de la institución ────────────────────────────────
                String instituto = "Instituto Educativo Lucy Tejada";
                cs.setFont(fuenteNormal, 14);
                float instX = centrarTexto(instituto, fuenteNormal, 14, anchoPage);
                cs.beginText();
                cs.newLineAtOffset(instX, altoPage - 145);
                cs.showText(instituto);
                cs.endText();

                // ── Línea separadora ────────────────────────────────────────
                cs.setLineWidth(1);
                cs.moveTo(50, altoPage - 165);
                cs.lineTo(anchoPage - 50, altoPage - 165);
                cs.stroke();

                // ── Texto introductorio ─────────────────────────────────────
                cs.setFont(fuenteNormal, 12);
                cs.beginText();
                cs.newLineAtOffset(70, altoPage - 220);
                cs.showText("El Instituto Educativo certifica que el/la estudiante:");
                cs.endText();

                // ── Nombre del estudiante (destacado) ──────────────────────
                cs.setFont(fuenteNegrita, 22);
                float nombreX = centrarTexto(estudiante.getNombre(), fuenteNegrita, 22, anchoPage);
                cs.beginText();
                cs.newLineAtOffset(nombreX, altoPage - 270);
                cs.showText(estudiante.getNombre());
                cs.endText();

                // ── Detalles del estudiante ─────────────────────────────────
                cs.setFont(fuenteNormal, 12);
                cs.beginText();
                cs.setLeading(22);
                cs.newLineAtOffset(70, altoPage - 330);
                cs.showText("Correo electronico : " + estudiante.getEmail());
                cs.newLine();
                cs.showText("Programa           : " + estudiante.getPrograma());
                cs.newLine();
                cs.newLine();
                cs.showText("Se encuentra debidamente matriculado(a) en los programas de");
                cs.newLine();
                cs.showText("nuestra institucion para el presente periodo academico.");
                cs.endText();

                // ── Fecha de expedición ─────────────────────────────────────
                String fecha = "Expedido el " + LocalDate.now()
                        .format(DateTimeFormatter.ofPattern("d 'de' MMMM 'de' yyyy",
                                new Locale("es", "CO")));
                cs.setFont(fuenteItalica, 11);
                cs.beginText();
                cs.newLineAtOffset(70, 150);
                cs.showText(fecha);
                cs.endText();

                // ── Línea de firma ──────────────────────────────────────────
                float firmaIzq = anchoPage / 2 - 70;
                float firmaDer = anchoPage / 2 + 70;
                cs.setLineWidth(1);
                cs.moveTo(firmaIzq, 110);
                cs.lineTo(firmaDer, 110);
                cs.stroke();

                String textoFirma = "Director(a) Academico(a)";
                cs.setFont(fuenteNormal, 10);
                float firmaX = centrarTexto(textoFirma, fuenteNormal, 10, anchoPage);
                cs.beginText();
                cs.newLineAtOffset(firmaX, 95);
                cs.showText(textoFirma);
                cs.endText();

                // ── Línea decorativa inferior ──────────────────────────────
                cs.setLineWidth(3);
                cs.moveTo(50, 60);
                cs.lineTo(anchoPage - 50, 60);
                cs.stroke();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        }
    }

    /** Calcula la posición X para centrar un texto en la página */
    private float centrarTexto(String texto, PDType1Font fuente, float tamano, float anchoPage)
            throws IOException {
        float anchoTexto = fuente.getStringWidth(texto) / 1000 * tamano;
        return (anchoPage - anchoTexto) / 2;
    }
}
