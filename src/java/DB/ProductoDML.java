/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

/**
 *
 * @author adamj
 */
public class ProductoDML {

    public static boolean crearProducto(Connection conn, String id, String categoria, String titulo, String descripcion, float precio, List<String> rutasImagenes) {
        PreparedStatement psProducto = null;
        PreparedStatement psImagen = null;
        ResultSet generatedKeys = null;

        try {
            // Insertar el producto
            String insertProductoSQL = "INSERT INTO productos (title, description, category, product_price, state, seller_id) VALUES (?, ?, ?, ?, 'Pendiente de aprobacion', ?)";
            psProducto = conn.prepareStatement(insertProductoSQL, Statement.RETURN_GENERATED_KEYS);
            psProducto.setString(1, titulo);
            psProducto.setString(2, descripcion);
            psProducto.setString(3, categoria);
            psProducto.setFloat(4, precio);
            psProducto.setString(5, id);

            int rowsInserted = psProducto.executeUpdate();

            if (rowsInserted == 0) {
                return false;
            }

            // Obtener el ID generado del producto
            generatedKeys = psProducto.getGeneratedKeys();
            int productId = -1;
            if (generatedKeys.next()) {
                productId = generatedKeys.getInt(1);
            } else {
                return false;
            }

            // Insertar las imágenes relacionadas
            String insertImagenSQL = "INSERT INTO imagenes_producto (image_url, product_id) VALUES (?, ?)";
            psImagen = conn.prepareStatement(insertImagenSQL);

            for (String ruta : rutasImagenes) {
                psImagen.setString(1, ruta);
                psImagen.setInt(2, productId);
                psImagen.addBatch();
            }

            psImagen.executeBatch();
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;

        } finally {
            try {
                if (generatedKeys != null) {
                    generatedKeys.close();
                }
                if (psProducto != null) {
                    psProducto.close();
                }
                if (psImagen != null) {
                    psImagen.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }

    public static boolean actualizarProducto(Connection conn, int productId, String categoria, String titulo, String descripcion, float precio) {
        PreparedStatement ps = null;

        try {
            String updateSQL = "UPDATE productos SET title = ?, description = ?, category = ?, product_price = ?, state = 'Pendiente de aprobacion' WHERE product_id = ?";
            ps = conn.prepareStatement(updateSQL);

            ps.setString(1, titulo);
            ps.setString(2, descripcion);
            ps.setString(3, categoria);
            ps.setFloat(4, precio);
            ps.setInt(5, productId);

            int rowsUpdated = ps.executeUpdate();
            return rowsUpdated > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;

        } finally {
            try {
                if (ps != null) {
                    ps.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
}
