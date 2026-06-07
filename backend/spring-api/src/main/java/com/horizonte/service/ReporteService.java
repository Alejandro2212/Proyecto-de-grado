package com.horizonte.service;

import com.horizonte.entity.AreaComun;
import com.horizonte.entity.Reserva;
import com.horizonte.entity.Usuario;
import com.horizonte.repository.AreaComunRepository;
import com.horizonte.repository.ReservaRepository;
import com.horizonte.repository.UsuarioRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReporteService {

    private final ReservaRepository reservaRepository;
    private final AreaComunRepository areaRepository;
    private final UsuarioRepository usuarioRepository;

    public ReporteService(
            ReservaRepository reservaRepository,
            AreaComunRepository areaRepository,
            UsuarioRepository usuarioRepository
    ) {

        this.reservaRepository = reservaRepository;
        this.areaRepository = areaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // =====================================
    // REPORTE GENERAL
    // =====================================
    public byte[] generarReporteGeneral() {

        try {

            Document document =
                    new Document(PageSize.A4.rotate());

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            PdfWriter.getInstance(
                    document,
                    out
            );

            document.open();

            Font titulo =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            20
                    );

            Font subtitulo =
                    FontFactory.getFont(
                            FontFactory.HELVETICA,
                            12
                    );

            Paragraph encabezado =
                    new Paragraph(
                            "REPORTE GENERAL DE RESERVAS",
                            titulo
                    );

            encabezado.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(encabezado);

            document.add(new Paragraph(
                    "Fecha de generación: "
                            + LocalDate.now(),
                    subtitulo
            ));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Total reservas: "
                            + reservaRepository.totalReservas()
            ));

            document.add(new Paragraph(
                    "Pendientes: "
                            + reservaRepository.countPendientes()
            ));

            document.add(new Paragraph(
                    "Aprobadas: "
                            + reservaRepository.countAprobadas()
            ));

            document.add(new Paragraph(
                    "Canceladas: "
                            + reservaRepository.countCanceladas()
            ));

            document.add(new Paragraph(" "));

            PdfPTable tabla =
                    new PdfPTable(6);

            tabla.setWidthPercentage(100);

            tabla.setWidths(
                    new float[]{
                            3, 3, 2, 2, 2, 2
                    }
            );

            agregarCabecera(tabla, "Usuario");
            agregarCabecera(tabla, "Área");
            agregarCabecera(tabla, "Fecha");
            agregarCabecera(tabla, "Inicio");
            agregarCabecera(tabla, "Fin");
            agregarCabecera(tabla, "Estado");

            List<Reserva> reservas =
                    reservaRepository.findAll();

for (Reserva r : reservas) {

    String usuario =
            "Sin usuario";

    if (r.getUsuario() != null) {

        usuario =
                r.getUsuario().getNombre()
                + " "
                + r.getUsuario().getApellido();
    }

    String area =
            r.getAreaComun() != null
                    ? r.getAreaComun().getNombre()
                    : "Sin área";

    String fecha =
            r.getFecha() != null
                    ? r.getFecha().toString()
                    : "-";

    String inicio =
            r.getHoraInicio() != null
                    ? r.getHoraInicio().toString()
                    : "-";

    String fin =
            r.getHoraFin() != null
                    ? r.getHoraFin().toString()
                    : "-";

    String estado =
            r.getEstado() != null
                    ? r.getEstado().name()
                    : "SIN ESTADO";

    tabla.addCell(usuario);
    tabla.addCell(area);
    tabla.addCell(fecha);
    tabla.addCell(inicio);
    tabla.addCell(fin);
    tabla.addCell(estado);
}

            document.add(tabla);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

    e.printStackTrace();

    throw new RuntimeException(
            "ERROR PDF: " + e.getMessage()
    );
}
    }

    // =====================================
    // REPORTE POR ÁREA
    // =====================================
    public byte[] generarReporteArea(
            Long areaId
    ) {

        try {

            AreaComun area =
                    areaRepository
                            .findById(areaId)
                            .orElseThrow();

            List<Reserva> reservas =
                    reservaRepository
                            .findByAreaComun_Id(areaId);

            Document document =
                    new Document(PageSize.A4);

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            PdfWriter.getInstance(
                    document,
                    out
            );

            document.open();

            Font titulo =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            18
                    );

            document.add(
                    new Paragraph(
                            "REPORTE POR ÁREA",
                            titulo
                    )
            );

            document.add(new Paragraph(" "));

            document.add(
                    new Paragraph(
                            "Área: "
                                    + area.getNombre()
                    )
            );

            document.add(
                    new Paragraph(
                            "Capacidad: "
                                    + area.getCapacidad()
                    )
            );

            document.add(
                    new Paragraph(
                            "Total reservas: "
                                    + reservas.size()
                    )
            );

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

    e.printStackTrace();

    throw new RuntimeException(
            "ERROR PDF: " + e.getMessage()
    );
}
    }

    // =====================================
    // REPORTE POR USUARIO
    // =====================================
    public byte[] generarReporteUsuario(
            Long usuarioId
    ) {

        try {

            Usuario usuario =
                    usuarioRepository
                            .findById(usuarioId)
                            .orElseThrow();

            List<Reserva> reservas =
                    reservaRepository
                            .findByUsuario_Id(usuarioId);

            Document document =
                    new Document(PageSize.A4);

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            PdfWriter.getInstance(
                    document,
                    out
            );

            document.open();

            Font titulo =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            18
                    );

            document.add(
                    new Paragraph(
                            "REPORTE POR USUARIO",
                            titulo
                    )
            );

            document.add(new Paragraph(" "));

            document.add(
                    new Paragraph(
                            "Nombre: "
                                    + usuario.getNombre()
                                    + " "
                                    + usuario.getApellido()
                    )
            );

            document.add(
                    new Paragraph(
                            "Correo: "
                                    + usuario.getEmail()
                    )
            );

            document.add(
                    new Paragraph(
                            "Reservas realizadas: "
                                    + reservas.size()
                    )
            );

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

    e.printStackTrace();

    throw new RuntimeException(
            "ERROR PDF: " + e.getMessage()
    );
}
    }

    // =====================================
    // CABECERAS DE TABLAS PDF
    // =====================================
    private void agregarCabecera(
            PdfPTable tabla,
            String texto
    ) {

        PdfPCell celda =
                new PdfPCell(
                        new Phrase(texto)
                );

        celda.setHorizontalAlignment(
                Element.ALIGN_CENTER
        );

        tabla.addCell(celda);
    }
}