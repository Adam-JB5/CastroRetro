/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api;

import DB.DBConnection;
import DB.UsuarioDML;
import Modelo.Usuario;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author adamj
 */
@WebServlet("/api/update-profile")
public class updateProfile extends HttpServlet {

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

        String id = request.getParameter("id");
        String password = request.getParameter("password");
        String username = request.getParameter("username");

        PrintWriter out = response.getWriter();

        try (Connection conn = DBConnection.getConnection()) {
            boolean actualizado = false;

            if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
                actualizado = UsuarioDML.actualizarUsernamePassword(conn, id, username, password);

            } else if (username != null && !username.isEmpty()) {
                actualizado = UsuarioDML.actualizarUsername(conn, id, username);

            } else if (password != null && !password.isEmpty()) {
                actualizado = UsuarioDML.actualizarPassword(conn, id, password);
            }

            if (actualizado) {
                Usuario usuarioActualizado = UsuarioDML.obtenerUsuarioPorId(conn, id);
                String usuarioJson = new Gson().toJson(usuarioActualizado);
                out.print("{\"success\": true, \"mensaje\": \"Perfil actualizado correctamente\", \"usuario\": " + usuarioJson + "}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\": false, \"mensaje\": \"No se actualizaron los datos correctamente\"}");
            }
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
