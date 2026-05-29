package com.horizonte.service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.horizonte.entity.Reserva;
import com.horizonte.repository.ReservaRepository;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class PdfService {

    private final ReservaRepository reservaRepository;

    public PdfService(
            ReservaRepository reservaRepository
    ) {
        this.reservaRepository = reservaRepository;
    }

    // =========================
    // GENERAR PDF
    // =========================
    public byte[] generarPdfReservas() {

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        Document document =
                new Document(PageSize.A4);

        try {

            PdfWriter.getInstance(
                    document,
                    out
            );

            document.open();

            // =========================
            // OBTENER DATOS
            // =========================
            List<Reserva> reservas =
                    reservaRepository.findAll();
                System.out.println(
                        "TOTAL RESERVAS PDF: "
                                + reservas.size()
                );

            // =========================
            // FUENTES
            // =========================
            Font tituloFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            20,
                            BaseColor.BLACK
                    );

            Font textoFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA,
                            11,
                            BaseColor.BLACK
                    );

            Font headerFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            11,
                            BaseColor.WHITE
                    );

            // =========================
            // TITULO
            // =========================
            Paragraph titulo =
                    new Paragraph(
                            "REPORTE GENERAL DE RESERVAS",
                            tituloFont
                    );

            titulo.setAlignment(Element.ALIGN_CENTER);

            document.add(titulo);

            document.add(new Paragraph(" "));

            // =========================
            // FECHA
            // =========================
            String fechaGeneracion =
                    LocalDateTime.now()
                            .format(
                                    DateTimeFormatter.ofPattern(
                                            "dd/MM/yyyy HH:mm"
                                    )
                            );

            Paragraph fecha =
                    new Paragraph(
                            "Fecha de generación: "
                                    + fechaGeneracion,
                            textoFont
                    );

            fecha.setAlignment(Element.ALIGN_RIGHT);

            document.add(fecha);

            document.add(new Paragraph(" "));

            // =========================
            // TABLA
            // =========================
            PdfPTable table =
                    new PdfPTable(5);

            table.setWidthPercentage(100);

            table.setSpacingBefore(10);

            table.setWidths(
                    new float[]{3, 3, 2, 2, 2}
            );

            // =========================
            // HEADERS
            // =========================
            agregarHeader(table, "Usuario", headerFont);
            agregarHeader(table, "Área", headerFont);
            agregarHeader(table, "Fecha", headerFont);
            agregarHeader(table, "Hora Inicio", headerFont);
            agregarHeader(table, "Hora Fin", headerFont);

            // =========================
            // DATOS
            // =========================
if (reservas.isEmpty()) {

    PdfPCell emptyCell =
            new PdfPCell(
                    new Phrase(
                            "NO EXISTEN RESERVAS REGISTRADAS",
                            textoFont
                    )
            );

    emptyCell.setColspan(5);

    emptyCell.setHorizontalAlignment(
            Element.ALIGN_CENTER
    );

    emptyCell.setPadding(15);

    table.addCell(emptyCell);

} else {

    for (Reserva r : reservas) {

        table.addCell(
                new Phrase(
                        r.getUsuario() != null
                                ? r.getUsuario().getNombre()
                                : "Sin usuario",
                        textoFont
                )
        );

        table.addCell(
                new Phrase(
                        r.getAreaComun() != null
                                ? r.getAreaComun().getNombre()
                                : "Sin área",
                        textoFont
                )
        );

        table.addCell(
                new Phrase(
                        r.getFecha() != null
                                ? r.getFecha().toString()
                                : "-",
                        textoFont
                )
        );

        table.addCell(
                new Phrase(
                        r.getHoraInicio() != null
                                ? r.getHoraInicio().toString()
                                : "-",
                        textoFont
                )
        );

        table.addCell(
                new Phrase(
                        r.getHoraFin() != null
                                ? r.getHoraFin().toString()
                                : "-",
                        textoFont
                )
        );
    }
}

            document.add(table);

            document.add(new Paragraph(" "));

            // =========================
            // FOOTER
            // =========================
            Paragraph footer =
                    new Paragraph(
                            "Sistema Inteligente de Reservas Horizonte © 2026",
                            textoFont
                    );

            footer.setAlignment(Element.ALIGN_CENTER);

            document.add(footer);

        } catch (Exception e) {

            e.printStackTrace();

        } finally {

            document.close();
        }

        return out.toByteArray();
    }

    // =========================
    // HEADER TABLA
    // =========================
    private void agregarHeader(
            PdfPTable table,
            String texto,
            Font font
    ) {

        PdfPCell header =
                new PdfPCell(
                        new Phrase(texto, font)
                );

        header.setBackgroundColor(
                new BaseColor(15, 23, 42)
        );

        header.setPadding(8);

        table.addCell(header);
    }
}