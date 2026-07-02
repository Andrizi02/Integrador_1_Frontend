package shiniproject.src.dao;

import java.util.LinkedHashMap;
import java.util.Map;

public class DashboardDAO {
    private ProductoDAO productoDAO;
    private PedidoDAO pedidoDAO;
    private UsuarioDAO usuarioDAO;

    public DashboardDAO() {
        this.productoDAO = new ProductoDAO();
        this.pedidoDAO = new PedidoDAO();
        this.usuarioDAO = new UsuarioDAO();
    }

    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("📦 Productos Activos", productoDAO.contarActivos());
        stats.put("🛒 Total Pedidos", pedidoDAO.contarTodos());
        stats.put("👥 Usuarios Registrados", usuarioDAO.listarTodos().size());
        stats.put("🧑‍🌾 Productores", usuarioDAO.contarPorRol("PRODUCTOR"));
        stats.put("🧑‍🍳 Compradores", usuarioDAO.contarPorRol("COMPRADOR"));
        stats.put("💰 Ingresos Totales", String.format("S/ %.2f", pedidoDAO.obtenerIngresosTotales()));
        stats.put("⏳ Pedidos Pendientes", pedidoDAO.contarPendientes());
        stats.put("✅ Pedidos Completados", pedidoDAO.contarCompletados());
        return stats;
    }
}
