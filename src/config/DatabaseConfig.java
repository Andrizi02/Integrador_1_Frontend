package shiniproject.src.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConfig {
    private static final String URL = "jdbc:postgresql://localhost:5432/Agroconnect";
    private static final String USER = "agroconnect_user";
    private static final String PASSWORD = "Agro2026Secure!";
    private static Connection connection = null;

    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            try {
                Class.forName("org.postgresql.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("✅ Conectado a PostgreSQL - AgroConnect");
            } catch (ClassNotFoundException e) {
                System.err.println("❌ Driver PostgreSQL no encontrado");
                throw new SQLException("Driver no encontrado", e);
            }
        }
        return connection;
    }

    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                System.out.println("🔌 Conexión cerrada");
            } catch (SQLException e) {
                System.err.println("Error al cerrar: " + e.getMessage());
            }
        }
    }
}
