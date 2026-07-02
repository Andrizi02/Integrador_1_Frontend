package shiniproject.src.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Pedido {
    private int id;
    private String numeroPedido;
    private int compradorId;
    private String compradorNombre;
    private String estado;
    private BigDecimal total;
    private LocalDateTime fechaCreacion;
    private List<DetallePedido> detalles;

    public Pedido() {
        this.detalles = new ArrayList<>();
        this.total = BigDecimal.ZERO;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNumeroPedido() { return numeroPedido; }
    public void setNumeroPedido(String numeroPedido) { this.numeroPedido = numeroPedido; }
    public int getCompradorId() { return compradorId; }
    public void setCompradorId(int compradorId) { this.compradorId = compradorId; }
    public String getCompradorNombre() { return compradorNombre; }
    public void setCompradorNombre(String compradorNombre) { this.compradorNombre = compradorNombre; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public List<DetallePedido> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedido> detalles) { this.detalles = detalles; }

    public void agregarDetalle(DetallePedido detalle) {
        this.detalles.add(detalle);
        this.total = this.total.add(detalle.getSubtotal());
    }

    @Override
    public String toString() {
        return String.format("%s | %s | Total: S/ %.2f | %s", 
            numeroPedido, compradorNombre, total, estado);
    }
}
