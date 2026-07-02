package shiniproject.src.dao;

import shiniproject.config.DatabaseConfig;
import shiniproject.model.DetallePedido;
import shiniproject.model.Pedido;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PedidoDAO {

    public List<Pedido> listarPedidos() {
        List<Pedido> lista = new ArrayList<>();
        String sql = "SELECT p.*, u.nombre as comprador_nombre FROM pedidos p " +
                     "JOIN usuarios u ON p.comprador_id = u.id ORDER BY p.fecha_creacion DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Pedido pedido = new Pedido();
                pedido.setId(rs.getInt("id"));
                pedido.setNumeroPedido(rs.getString("numero_pedido"));
                pedido.setCompradorId(rs.getInt("comprador_id"));
                pedido.setCompradorNombre(rs.getString("comprador_nombre"));
                pedido.setEstado(rs.getString("estado"));
                pedido.setTotal(rs.getBigDecimal("total"));
                pedido.setFechaCreacion(rs.getTimestamp("fecha_creacion").toLocalDateTime());
                lista.add(pedido);
            }
        } catch (SQLException e) {
            System.err.println("Error listar pedidos: " + e.getMessage());
        }
        return lista;
    }

    public int contarPendientes() {
        String sql = "SELECT COUNT(*) FROM pedidos WHERE estado = 'PENDIENTE'";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("Error contar pendientes: " + e.getMessage());
        }
        return 0;
    }

    public int contarCompletados() {
        String sql = "SELECT COUNT(*) FROM pedidos WHERE estado = 'COMPLETADO'";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("Error contar completados: " + e.getMessage());
        }
        return 0;
    }

    public double obtenerIngresosTotales() {
        String sql = "SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE estado = 'COMPLETADO'";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getDouble(1);
        } catch (SQLException e) {
            System.err.println("Error ingresos: " + e.getMessage());
        }
        return 0;
    }

    public int contarTodos() {
        String sql = "SELECT COUNT(*) FROM pedidos";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("Error contar: " + e.getMessage());
        }
        return 0;
    }
}
