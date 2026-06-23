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
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.ChartUtils;

import org.jfree.data.category.DefaultCategoryDataset;

import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.io.InputStream;

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


    // REPORTE GENERAL

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

                agregarLogo(document);

                Paragraph empresa =
                        new Paragraph(
                                "CONDOMINIO HORIZONTE",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        22
                                )
                        );

                empresa.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(empresa);

                Paragraph sistema =
                        new Paragraph(
                                "Sistema Inteligente de Reservas",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA,
                                        12
                                )
                        );

                sistema.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(sistema);

                document.add(
                        new Paragraph(" ")
                );

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

        Paragraph subtituloSistema =
                new Paragraph(
                        "Sistema Inteligente de Reservas de Áreas Comunes",
                        FontFactory.getFont(
                                FontFactory.HELVETICA,
                                12
                        )
                );

        subtituloSistema.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(subtituloSistema);

        document.add(
                new Paragraph(" ")
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

                PdfPTable resumen =
                        new PdfPTable(4);

                resumen.setWidthPercentage(100);

                resumen.setSpacingBefore(10);

                resumen.setSpacingAfter(20);

                resumen.addCell(
                        crearTarjeta(
                                "TOTAL",
                                String.valueOf(
                                        reservaRepository.totalReservas()
                                )
                        )
                );

                resumen.addCell(
                        crearTarjeta(
                                "PENDIENTES",
                                String.valueOf(
                                        reservaRepository.countPendientes()
                                )
                        )
                );

                resumen.addCell(
                        crearTarjeta(
                                "APROBADAS",
                                String.valueOf(
                                        reservaRepository.countAprobadas()
                                )
                        )
                );

                resumen.addCell(
                        crearTarjeta(
                                "CANCELADAS",
                                String.valueOf(
                                        reservaRepository.countCanceladas()
                                )
                        )
                );

                document.add(resumen);

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

        Long totalReservas =
                reservaRepository.totalReservas();

        Long aprobadas =
                reservaRepository.countAprobadas();

        Long pendientes =
                reservaRepository.countPendientes();

        Long canceladas =
                reservaRepository.countCanceladas();


        double porcentajeAprobacion = 0;

        double porcentajeCancelacion = 0;

        if (totalReservas > 0) {

        porcentajeAprobacion =
                (aprobadas.doubleValue()
                        / totalReservas.doubleValue())
                        * 100;

        porcentajeCancelacion =
                (canceladas.doubleValue()
                        / totalReservas.doubleValue())
                        * 100;
        }

        String areaMasReservada =
                "Sin datos";

        List<Object[]> topAreas =
                reservaRepository.areaMasReservada();

        if (!topAreas.isEmpty()) {

        areaMasReservada =
                String.valueOf(
                        topAreas.get(0)[0]
                );
        }

        String areaMenosReservada =
        "Sin datos";

        List<Object[]> menosAreas =
                reservaRepository.areaMenosReservada();

        if (!menosAreas.isEmpty()) {

        areaMenosReservada =
                String.valueOf(
                        menosAreas.get(0)[0]
                );
        }
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

                document.add(
                        new Paragraph(" ")
                );

        // =====================================
        // ESTADÍSTICAS DEL SISTEMA
        // =====================================

        Paragraph estadisticasTitulo =
                new Paragraph(
                        "ESTADÍSTICAS GENERALES",
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                16
                        )
                );

        estadisticasTitulo.setSpacingBefore(20);

        document.add(estadisticasTitulo);

        document.add(new Paragraph(
                "Porcentaje de aprobación: "
                        + String.format("%.2f", porcentajeAprobacion)
                        + "%"
        ));

        document.add(new Paragraph(
                "Porcentaje de cancelación: "
                        + String.format("%.2f", porcentajeCancelacion)
                        + "%"
        ));

        document.add(new Paragraph(
                "Área más reservada: "
                        + areaMasReservada
        ));

        document.add(new Paragraph(
                "Área menos reservada: "
                        + areaMenosReservada
        ));

        document.add(new Paragraph(" "));

        PdfPTable resumenEjecutivo =
                new PdfPTable(2);

        resumenEjecutivo.setWidthPercentage(60);

        resumenEjecutivo.addCell("Indicador");
        resumenEjecutivo.addCell("Valor");

        resumenEjecutivo.addCell("Total Reservas");
        resumenEjecutivo.addCell(
                totalReservas.toString()
        );

        resumenEjecutivo.addCell("Aprobadas");
        resumenEjecutivo.addCell(
                aprobadas.toString()
        );

        resumenEjecutivo.addCell("Pendientes");
        resumenEjecutivo.addCell(
                pendientes.toString()
        );

        resumenEjecutivo.addCell("Canceladas");
        resumenEjecutivo.addCell(
                canceladas.toString()
        );

        document.add(resumenEjecutivo);
        document.add(new Paragraph(" "));

        Paragraph graficoTitulo =
                new Paragraph(
                        "RESERVAS POR ÁREA",
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                16
                        )
                );

        document.add(graficoTitulo);

        document.add(new Paragraph(" "));

        DefaultCategoryDataset dataset =
                new DefaultCategoryDataset();

        List<Object[]> areas =
                reservaRepository.reservasPorArea();

        for (Object[] fila : areas) {

        String nombreArea =
                String.valueOf(fila[0]);

        Number total =
                (Number) fila[1];

        dataset.addValue(
                total.doubleValue(),
                "Reservas",
                nombreArea
        );
        }

        JFreeChart chart =
                ChartFactory.createBarChart(

                        "Reservas por Área",

                        "Área",

                        "Cantidad",

                        dataset
                );

        BufferedImage bufferedImage =
                chart.createBufferedImage(
                        700,
                        400
                );

                ByteArrayOutputStream chartOut =
                        new ByteArrayOutputStream();

                ImageIO.write(
                        bufferedImage,
                        "png",
                        chartOut
                );

                Image grafico =
                        Image.getInstance(
                                chartOut.toByteArray()
                        );

                grafico.scaleToFit(
                        500,
                        300
                );

                grafico.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(grafico);

                document.add(
                        new Paragraph(" ")
                );

                Paragraph graficoMesTitulo =
                        new Paragraph(
                                "RESERVAS POR MES",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        16
                                )
                        );

                document.add(
                        graficoMesTitulo
                );

                document.add(
                        new Paragraph(" ")
                );

                DefaultCategoryDataset datasetMes =
                        new DefaultCategoryDataset();

                List<Object[]> meses =
                        reservaRepository.reservasPorMes();

                String[] nombresMeses = {

                        "",
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre"
                };

                for (Object[] fila : meses) {

                Integer numeroMes =
                        ((Number) fila[0]).intValue();

                Number total =
                        (Number) fila[1];

                datasetMes.addValue(

                        total.doubleValue(),

                        "Reservas",

                        nombresMeses[numeroMes]
                );
                }

                JFreeChart chartMes =
                        ChartFactory.createLineChart(

                                "Reservas por Mes",

                                "Mes",

                                "Cantidad",

                                datasetMes
                        );

                BufferedImage bufferedMes =
                        chartMes.createBufferedImage(
                                700,
                                400
                        );

                ByteArrayOutputStream mesOut =
                        new ByteArrayOutputStream();

                ImageIO.write(

                        bufferedMes,

                        "png",

                        mesOut
                );

                Image graficoMes =
                        Image.getInstance(
                                mesOut.toByteArray()
                        );

                graficoMes.scaleToFit(
                        500,
                        300
                );

                graficoMes.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(
                        graficoMes
                );

        Paragraph analisisTitulo =
                new Paragraph(
                        "ANÁLISIS EJECUTIVO",
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                16
                        )
                );

        analisisTitulo.setSpacingBefore(20);

        document.add(analisisTitulo);

        PdfPTable analisis =
                new PdfPTable(2);

        analisis.setWidthPercentage(100);

        analisis.setWidths(
                new float[]{4, 6}
        );

        agregarCabecera(
                analisis,
                "Indicador"
        );

        agregarCabecera(
                analisis,
                "Resultado"
        );

        analisis.addCell(
                "Área más utilizada"
        );

        analisis.addCell(
                areaMasReservada
        );

        analisis.addCell(
                "Área menos utilizada"
        );

        analisis.addCell(
                areaMenosReservada
        );

        analisis.addCell(
                "Reservas aprobadas"
        );

        analisis.addCell(
                aprobadas.toString()
        );

        analisis.addCell(
                "Reservas pendientes"
        );

        analisis.addCell(
                pendientes.toString()
        );

        analisis.addCell(
                "Reservas canceladas"
        );

        analisis.addCell(
                canceladas.toString()
        );

        analisis.addCell(
                "Porcentaje aprobación"
        );

        analisis.addCell(
                String.format(
                        "%.2f %%", porcentajeAprobacion
                )
        );

        analisis.addCell(
                "Porcentaje cancelación"
        );

        analisis.addCell(
                String.format(
                        "%.2f %%", porcentajeCancelacion
                )
        );

        document.add(analisis);

                Paragraph footer =
                        new Paragraph(
                                "Condominio Horizonte © 2026 - Sistema Inteligente de Reservas",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA,
                                        10
                                )
                        );

                footer.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(footer);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

    e.printStackTrace();

    throw new RuntimeException(
            "ERROR PDF: " + e.getMessage()
    );
}
    }

 
    // REPORTE POR ÁREA

        public byte[] generarReporteArea(Long areaId) {

        try {

                AreaComun area =
                        areaRepository
                                .findById(areaId)
                                .orElseThrow();

                List<Reserva> reservas =
                        reservaRepository
                                .findByAreaComun_Id(areaId);

                Document document =
                        new Document(PageSize.A4.rotate());

                ByteArrayOutputStream out =
                        new ByteArrayOutputStream();

                PdfWriter.getInstance(
                        document,
                        out
                );

                document.open();

                agregarLogo(document);

                Paragraph empresa =
                        new Paragraph(
                                "CONDOMINIO HORIZONTE",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        20
                                )
                        );

                empresa.setAlignment(Element.ALIGN_CENTER);

                document.add(empresa);

                document.add(
                        new Paragraph(
                                "Sistema Inteligente de Reservas",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA,
                                        12
                                )
                        )
                );

                document.add(new Paragraph(" "));

                Paragraph titulo =
                        new Paragraph(
                                "REPORTE DEL ÁREA",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        18
                                )
                        );

                titulo.setAlignment(Element.ALIGN_CENTER);

                document.add(titulo);

                document.add(new Paragraph(" "));

                document.add(
                        new Paragraph(
                                "Área: " + area.getNombre()
                        )
                );

                document.add(
                        new Paragraph(
                                "Capacidad: " + area.getCapacidad()
                        )
                );

                document.add(
                        new Paragraph(
                                "Reservas registradas: "
                                        + reservas.size()
                        )
                );

                document.add(new Paragraph(" "));

                PdfPTable tabla =
                        new PdfPTable(5);

                tabla.setWidthPercentage(100);

                agregarCabecera(tabla, "Usuario");
                agregarCabecera(tabla, "Fecha");
                agregarCabecera(tabla, "Hora Inicio");
                agregarCabecera(tabla, "Hora Fin");
                agregarCabecera(tabla, "Estado");

                for (Reserva r : reservas) {

                String usuario =
                        r.getUsuario() != null
                                ? r.getUsuario().getNombre()
                                + " "
                                + r.getUsuario().getApellido()
                                : "-";

                tabla.addCell(usuario);

                tabla.addCell(
                        r.getFecha() != null
                                ? r.getFecha().toString()
                                : "-"
                );

                tabla.addCell(
                        r.getHoraInicio() != null
                                ? r.getHoraInicio().toString()
                                : "-"
                );

                tabla.addCell(
                        r.getHoraFin() != null
                                ? r.getHoraFin().toString()
                                : "-"
                );

                tabla.addCell(
                        r.getEstado() != null
                                ? r.getEstado().name()
                                : "-"
                );
                }

                document.add(tabla);

                document.add(new Paragraph(" "));

                Paragraph footer =
                        new Paragraph(
                                "Condominio Horizonte © 2026",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA,
                                        10
                                )
                        );

                footer.setAlignment(Element.ALIGN_CENTER);

                document.add(footer);

                document.close();

                return out.toByteArray();

        } catch (Exception e) {

                e.printStackTrace();

                throw new RuntimeException(
                        "ERROR PDF: " + e.getMessage()
                );
        }
        }


    // REPORTE POR USUARIO
 
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
                        new Document(PageSize.A4.rotate());

                ByteArrayOutputStream out =
                        new ByteArrayOutputStream();

                PdfWriter.getInstance(
                        document,
                        out
                );

                document.open();

                // ==========================
                // LOGO
                // ==========================

                agregarLogo(document);

                Paragraph empresa =
                        new Paragraph(
                                "CONDOMINIO HORIZONTE",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        20
                                )
                        );

                empresa.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(empresa);

                Paragraph sistema =
                        new Paragraph(
                                "Sistema Inteligente de Reservas",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA,
                                        12
                                )
                        );

                sistema.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(sistema);

                document.add(
                        new Paragraph(" ")
                );

                // ==========================
                // TITULO
                // ==========================

                Paragraph titulo =
                        new Paragraph(
                                "REPORTE DE USUARIO",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        18
                                )
                        );

                titulo.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(titulo);

                document.add(
                        new Paragraph(" ")
                );

                // ==========================
                // DATOS USUARIO
                // ==========================

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
                        new Paragraph(" ")
                );

                // ==========================
                // TARJETA RESUMEN
                // ==========================

                PdfPTable resumen =
                        new PdfPTable(1);

                resumen.setWidthPercentage(40);

                resumen.addCell(
                        crearTarjeta(
                                "TOTAL RESERVAS",
                                String.valueOf(
                                        reservas.size()
                                )
                        )
                );

                document.add(resumen);

                document.add(
                        new Paragraph(" ")
                );

                // ==========================
                // ESTADISTICAS
                // ==========================

                long aprobadas =
                        reservas.stream()
                                .filter(r ->
                                        r.getEstado() != null
                                        &&
                                        r.getEstado().name()
                                                .equals("APROBADA")
                                )
                                .count();

                long pendientes =
                        reservas.stream()
                                .filter(r ->
                                        r.getEstado() != null
                                        &&
                                        r.getEstado().name()
                                                .equals("PENDIENTE")
                                )
                                .count();

                long canceladas =
                        reservas.stream()
                                .filter(r ->
                                        r.getEstado() != null
                                        &&
                                        r.getEstado().name()
                                                .equals("CANCELADA")
                                )
                                .count();

                Paragraph estadisticas =
                        new Paragraph(
                                "ESTADÍSTICAS DEL USUARIO",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        15
                                )
                        );

                document.add(estadisticas);

                document.add(
                        new Paragraph(
                                "Reservas aprobadas: "
                                        + aprobadas
                        )
                );

                document.add(
                        new Paragraph(
                                "Reservas pendientes: "
                                        + pendientes
                        )
                );

                document.add(
                        new Paragraph(
                                "Reservas canceladas: "
                                        + canceladas
                        )
                );

                document.add(
                        new Paragraph(" ")
                );

                // ==========================
                // HISTORIAL
                // ==========================

                Paragraph historial =
                        new Paragraph(
                                "HISTORIAL DE RESERVAS",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        15
                                )
                        );

                document.add(historial);

                document.add(
                        new Paragraph(" ")
                );

                PdfPTable tabla =
                        new PdfPTable(5);

                tabla.setWidthPercentage(100);

                agregarCabecera(tabla, "Área");
                agregarCabecera(tabla, "Fecha");
                agregarCabecera(tabla, "Hora Inicio");
                agregarCabecera(tabla, "Hora Fin");
                agregarCabecera(tabla, "Estado");

                for (Reserva r : reservas) {

                tabla.addCell(
                        r.getAreaComun() != null
                                ? r.getAreaComun().getNombre()
                                : "-"
                );

                tabla.addCell(
                        r.getFecha() != null
                                ? r.getFecha().toString()
                                : "-"
                );

                tabla.addCell(
                        r.getHoraInicio() != null
                                ? r.getHoraInicio().toString()
                                : "-"
                );

                tabla.addCell(
                        r.getHoraFin() != null
                                ? r.getHoraFin().toString()
                                : "-"
                );

                tabla.addCell(
                        r.getEstado() != null
                                ? r.getEstado().name()
                                : "-"
                );
                }

                document.add(tabla);

                document.add(
                        new Paragraph(" ")
                );

                // ==========================
                // FOOTER
                // ==========================

                Paragraph footer =
                        new Paragraph(
                                "Condominio Horizonte © 2026 - Sistema Inteligente de Reservas",
                                FontFactory.getFont(
                                        FontFactory.HELVETICA,
                                        10
                                )
                        );

                footer.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(footer);

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
                        new Phrase(
                                texto,
                                FontFactory.getFont(
                                        FontFactory.HELVETICA_BOLD,
                                        11,
                                        BaseColor.WHITE
                                )
                        )
                );

        celda.setBackgroundColor(
                new BaseColor(
                        15,
                        23,
                        42
                )
        );

        celda.setPadding(10);

        celda.setHorizontalAlignment(
                Element.ALIGN_CENTER
        );

        tabla.addCell(celda);
    }

        private PdfPCell crearTarjeta(
                String titulo,
                String valor
        ) {

        PdfPCell celda =
                new PdfPCell();

        celda.addElement(
                new Paragraph(
                        titulo,
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                12
                        )
                )
        );

        celda.addElement(
                new Paragraph(
                        valor,
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                18
                        )
                )
        );

        celda.setPadding(15);

        celda.setHorizontalAlignment(
                Element.ALIGN_CENTER
        );

        return celda;
        }

        private void agregarLogo(Document document) {

        try {

                InputStream is =
                        getClass()
                                .getResourceAsStream(
                                        "/static/logo-horizonte.png"
                                );

                if (is != null) {

                Image logo =
                        Image.getInstance(
                                is.readAllBytes()
                        );

                logo.scaleToFit(
                        100,
                        100
                );

                logo.setAlignment(
                        Element.ALIGN_CENTER
                );

                document.add(logo);
                }

        } catch (Exception e) {

                e.printStackTrace();
        }
        }
}