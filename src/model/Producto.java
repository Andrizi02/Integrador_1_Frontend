package shiniproject.src.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Producto {
    private int id;
    private String nombre;
    private String tipo;
    private int cantidad;
    private BigDecimal precio;
    private String ubicacion;
    private String descripcion;
    private String imagen;
    private int productorId;
    private String productorNombre;
    private boolean activo;
    private LocalDateTime fechaCreacion;

    public Producto() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
    public int getProductorId() { return productorId; }
    public void setProductorId(int productorId) { this.productorId = productorId; }
    public String getProductorNombre() { return productorNombre; }
    public void setProductorNombre(String productorNombre) { this.productorNombre = productorNombre; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    @Override
    public String toString() {
        return String.format("%s %s | S/ %.2f | Stock: %d | %s", 
            imagen != null ? imagen : "📦", nombre, precio, cantidad, ubicacion);
    }
}
