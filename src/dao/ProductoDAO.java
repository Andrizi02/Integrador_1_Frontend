package shiniproject.src.dao;

import shiniproject.config.DatabaseConfig;
import com.agroconnect.model.Producto;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductoDAO {

    public List<Producto> listarActivos() {
        List<Producto> lista = new ArrayList<>();
        String sql = "SELECT p.*, u.nombre as productor_nombre FROM productos p " +
                     "JOIN usuarios u ON p.productor_id = u.id " +
                     "WHERE p.activo = true ORDER BY p.id";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                lista.add(mapearProducto(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error listar productos: " + e.getMessage());
        }
        return lista;
    }

    public List<Producto> buscarPorNombre(String busqueda) {
        List<Producto> lista = new ArrayList<>();
        String sql = "SELECT p.*, u.nombre as productor_nombre FROM productos p " +
                     "JOIN usuarios u ON p.productor_id = u.id " +
                     "WHERE p.activo = true AND (p.nombre ILIKE ? OR p.ubicacion ILIKE ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, "%" + busqueda + "%");
            stmt.setString(2, "%" + busqueda + "%");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                lista.add(mapearProducto(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error buscar: " + e.getMessage());
        }
        return lista;
    }

    public boolean crearProducto(Producto p) {
        String sql = "INSERT INTO productos (nombre, tipo, cantidad, precio, ubicacion, descripcion, imagen, productor_id) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, p.getNombre());
            stmt.setString(2, p.getTipo());
            stmt.setInt(3, p.getCantidad());
            stmt.setBigDecimal(4, p.getPrecio());
            stmt.setString(5, p.getUbicacion());
            stmt.setString(6, p.getDescripcion());
            stmt.setString(7, p.getImagen());
            stmt.setInt(8, p.getProductorId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error crear producto: " + e.getMessage());
        }
        return false;
    }

    public boolean eliminarProducto(int id) {
        String sql = "UPDATE productos SET activo = false WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error eliminar: " + e.getMessage());
        }
        return false;
    }

    public int contarActivos() {
        String sql = "SELECT COUNT(*) FROM productos WHERE activo = true";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("Error contar: " + e.getMessage());
        }
        return 0;
    }

    private Producto mapearProducto(ResultSet rs) throws SQLException {
        Producto p = new Producto();
        p.setId(rs.getInt("id"));
        p.setNombre(rs.getString("nombre"));
        p.setTipo(rs.getString("tipo"));
        p.setCantidad(rs.getInt("cantidad"));
        p.setPrecio(rs.getBigDecimal("precio"));
        p.setUbicacion(rs.getString("ubicacion"));
        p.setDescripcion(rs.getString("descripcion"));
        p.setImagen(rs.getString("imagen"));
        p.setProductorId(rs.getInt("productor_id"));
        p.setProductorNombre(rs.getString("productor_nombre"));
        p.setActivo(rs.getBoolean("activo"));
        p.setFechaCreacion(rs.getTimestamp("fecha_creacion").toLocalDateTime());
        return p;
    }
}
