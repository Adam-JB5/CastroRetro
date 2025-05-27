/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author adamj
 */
@WebServlet("/api/detect-console")
public class detectConsole extends HttpServlet {

    private static final String NYCKEL_API_URL = "https://www.nyckel.com/v1/functions/gaming-console-model/invoke";
    private static final String BEARER_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJodHRwczovL3d3dy5ueWNrZWwuY29tIiwibmJmIjoxNzQ4MzU3NTY1LCJpYXQiOjE3NDgzNTc1NjUsImV4cCI6MTc0ODM2MTE2NSwic2NvcGUiOlsiYXBpIl0sImNsaWVudF9pZCI6InJ1MTF2Y3FzMHY4cGR0MGFnczl0NWd5OThmcDFudzA5IiwianRpIjoiNUZCODI3NkM3N0RBOTBGNDQ2QTVCMjg4QzQ0MDYzOEEifQ.PAHnTFpG_m3jIxS1n7tr0z_50IiNmOneyvgh_UWBzJH-ROVQE6E3dUnNxb0dW5C3cicev2h5kiI5s_m0VCpdey1JwpjpDy5kZf_LA5NogCnKYEGZUiRNf5N2hdk0wwVia0J6I-SSUOKIcc52yzi3CEI3GwrGngNj1sMC0zcw3hDQxwzTd9Let6IHKgJkBfwf-SNNBAtKmAgVuKwbAn8pjYyAaIarXURhqNf6Y52h5TOkDziW26euuzNMlRIqVF_76hXkusFA0ahO2-Cnba8VFPVc2YDohW84vskiOcxQi7ekPjCQqpq3NXHrhE-rVz5YEpI-GAgeCicRoSIYmSn__g"; // Póngalo como variable de entorno para mayor seguridad

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        PrintWriter out = response.getWriter();

        try {
            // Leer el JSON recibido del frontend
            BufferedReader reader = request.getReader();
            JsonObject inputJson = new Gson().fromJson(reader, JsonObject.class);
            String imagenBase64 = inputJson.get("imagen").getAsString();

            // Preparar JSON para Nyckel
            JsonObject nyckelRequest = new JsonObject();
            nyckelRequest.addProperty("data", imagenBase64);
            String jsonBody = nyckelRequest.toString();

            // Hacer el fetch a Nyckel
            URL url = new URL(NYCKEL_API_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + BEARER_TOKEN);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = conn.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    status >= 400 ? conn.getErrorStream() : conn.getInputStream()));
            StringBuilder responseContent = new StringBuilder();
            String line;

            while ((line = in.readLine()) != null) {
                responseContent.append(line);
            }

            in.close();
            conn.disconnect();

            // Enviar la respuesta a frontend
            out.print(responseContent.toString());

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonObject errorJson = new JsonObject();
            errorJson.addProperty("error", "Error procesando la imagen: " + e.getMessage());
            out.print(errorJson.toString());
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
