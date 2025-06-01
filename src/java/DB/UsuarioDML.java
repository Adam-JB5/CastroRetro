/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DB;

import Modelo.Usuario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.mindrot.jbcrypt.BCrypt;

/**
 *
 * @author adamj
 */
public class UsuarioDML {

    public static Usuario obtenerUsuarioLogin(Connection conn, String email, String password) throws Exception {
        String sql = "SELECT * FROM usuarios WHERE email = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String hashedPassword = rs.getString("password");

                if (BCrypt.checkpw(password, hashedPassword)) {
                    // Contraseña válida, construir y devolver el usuario
                    return new Usuario(
                            rs.getInt("user_id"),
                            rs.getString("username"),
                            rs.getString("email"),
                            hashedPassword,
                            rs.getDate("sign_up_date"),
                            rs.getBoolean("is_admin"),
                            rs.getString("profile_image")
                    );
                }
            }

            // Usuario no encontrado o contraseña incorrecta
            return null;
        }
    }

    public static Usuario obtenerUsuarioPorId(Connection conn, String id) throws Exception {
        String sql = "SELECT * FROM usuarios WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new Usuario(
                        rs.getInt("user_id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getDate("sign_up_date"),
                        rs.getBoolean("is_admin"),
                        rs.getString("profile_image")
                );
            }

            return null;
        }
    }

    public static boolean actualizarUsername(Connection conn, String id, String username) throws Exception {
        String sql = "UPDATE usuarios SET username = ? WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setString(2, id);
            return stmt.executeUpdate() > 0;
        }
    }

    public static boolean actualizarPassword(Connection conn, String id, String password) throws Exception {
        String sql = "UPDATE usuarios SET password = ? WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, password);
            stmt.setString(2, id);
            return stmt.executeUpdate() > 0;
        }
    }

    public static boolean actualizarUsernamePassword(Connection conn, String id, String username, String password) throws Exception {
        String sql = "UPDATE usuarios SET username = ?, password = ? WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, id);
            return stmt.executeUpdate() > 0;
        }
    }

    public static boolean actualizarImagenPerfil(Connection conn, String id, String ruta) throws Exception {
        String sql = "UPDATE usuarios SET profile_image = ? WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, ruta);
            stmt.setString(2, id);
            return stmt.executeUpdate() > 0;
        }
    }
}
