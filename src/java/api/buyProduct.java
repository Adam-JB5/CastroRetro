/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api;

import DB.DBConnection;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author adamj
 */
@WebServlet("/api/buy")
public class buyProduct extends HttpServlet {

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
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

        String userIdParam = request.getParameter("userId");
        String productIdParam = request.getParameter("productId");
        String productPriceParam = request.getParameter("productPrice");

        PrintWriter out = response.getWriter();

        try {
            int userId = Integer.parseInt(userIdParam);
            int productId = Integer.parseInt(productIdParam);
            BigDecimal precio = new BigDecimal(productPriceParam);

            try (Connection conn = DBConnection.getConnection()) {
                conn.setAutoCommit(false);

                try {
                    // Insertar la compra
                    String insertSql = "INSERT INTO compras (purchase_price, buyer_id, product_id) VALUES (?, ?, ?)";
                    PreparedStatement insertStmt = conn.prepareStatement(insertSql);
                    insertStmt.setBigDecimal(1, precio);
                    insertStmt.setInt(2, userId);
                    insertStmt.setInt(3, productId);
                    insertStmt.executeUpdate();

                    // Actualizar estado del producto a 'Vendido'
                    String updateSql = "UPDATE productos SET state = 'Vendido' WHERE product_id = ?";
                    PreparedStatement updateStmt = conn.prepareStatement(updateSql);
                    updateStmt.setInt(1, productId);
                    updateStmt.executeUpdate();

                    conn.commit();
                    out.print("{\"success\": true, \"mensaje\": \"Compra registrada exitosamente\"}");

                } catch (Exception e) {
                    conn.rollback(); //Revierte en caso de fallo
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"success\": false, \"mensaje\": \"Error al registrar la compra: " + e.getMessage() + "\"}");
                }

            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"mensaje\": \"Error general: " + e.getMessage() + "\"}");
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
