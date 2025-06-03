/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api;

import DB.DBConnection;
import Modelo.Producto;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author adamj
 */
@WebServlet("/api/products")
public class products extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

        String categoria = request.getParameter("categoria");
        String estado = request.getParameter("estado");

        System.out.println("categoria: " + categoria);
        PrintWriter out = response.getWriter();

        try (Connection conn = DBConnection.getConnection()) {

            StringBuilder query = new StringBuilder(
                    "SELECT p.product_id, p.title, p.description, p.category, p.product_price, p.publish_date, p.state, p.seller_id, i.image_url "
                    + "FROM productos p LEFT JOIN imagenes_producto i ON p.product_id = i.product_id "
            );

            List<String> condiciones = new ArrayList<>();
            List<Object> parametros = new ArrayList<>();

            if (categoria != null && !categoria.isEmpty()) {
                condiciones.add("p.category = ?");
                parametros.add(categoria);
            }

            if (estado != null && !estado.isEmpty()) {
                condiciones.add("p.state = ?");
                parametros.add(estado);
            }

            if (!condiciones.isEmpty()) {
                query.append("WHERE ").append(String.join(" AND ", condiciones)).append(" ");
            }

            query.append("ORDER BY p.publish_date DESC");

            PreparedStatement stmt = conn.prepareStatement(query.toString());

            for (int i = 0; i < parametros.size(); i++) {
                stmt.setObject(i + 1, parametros.get(i));
            }

            ResultSet rs = stmt.executeQuery();

            Map<Integer, Producto> productosMap = new LinkedHashMap<>();

            while (rs.next()) {
                int productId = rs.getInt("product_id");

                // Si aún no hemos creado el producto, lo instanciamos y lo guardamos
                if (!productosMap.containsKey(productId)) {
                    Producto producto = new Producto(
                            productId,
                            rs.getString("title"),
                            rs.getString("description"),
                            rs.getString("category"),
                            rs.getBigDecimal("product_price"),
                            rs.getDate("publish_date"),
                            rs.getString("state"),
                            rs.getInt("seller_id"),
                            new ArrayList<>() // Lista de imágenes vacía, se llenará luego
                    );

                    productosMap.put(productId, producto);
                }

                // Agregar imagen si existe
                String imageUrl = rs.getString("image_url");
                if (imageUrl != null) {
                    productosMap.get(productId).getImages().add(imageUrl);
                }
            }

            String json = new Gson().toJson(new ArrayList<>(productosMap.values()));
            out.print(json);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"mensaje\": \"Error en el servidor: " + e.getMessage() + "\"}");
        }

        out.flush();
    }

// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
