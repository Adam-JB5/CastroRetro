/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api;

import DB.DBConnection;
import DB.ProductoDML;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author adamj
 */
@WebServlet("/api/update-products")
@MultipartConfig
public class updateProduct extends HttpServlet {

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

        PrintWriter out = response.getWriter();

        try {
            // Obtener datos del formulario
            String productIdStr = request.getParameter("id");
            String categoria = request.getParameter("categoria");
            String titulo = request.getParameter("titulo");
            String descripcion = request.getParameter("descripcion");
            String precioStr = request.getParameter("precio");

            // Validar datos obligatorios
            if (productIdStr == null || categoria == null || titulo == null || descripcion == null
                    || precioStr == null || categoria.isEmpty() || titulo.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\": false, \"mensaje\": \"Faltan datos obligatorios\"}");
                return;
            }

            int productId;
            try {
                productId = Integer.parseInt(productIdStr);
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\": false, \"mensaje\": \"ID de producto inválido\"}");
                return;
            }

            float precio;
            try {
                precio = Float.parseFloat(precioStr);
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\": false, \"mensaje\": \"Precio invalido\"}");
                return;
            }

            // Actualizar en base de datos
            try (Connection conn = DBConnection.getConnection()) {
                boolean actualizado = ProductoDML.actualizarProducto(conn, productId, categoria, titulo, descripcion, precio);

                if (actualizado) {
                    out.print("{\"success\": true, \"mensaje\": \"Producto actualizado correctamente\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"success\": false, \"mensaje\": \"Error al actualizar el producto en la base de datos\"}");
                }
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"mensaje\": \"Error del servidor: " + e.getMessage() + "\"}");
        }
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
