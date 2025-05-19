/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Modelo;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author adamj
 */
public class Usuario implements Serializable {

    private int userId;
    private String username;
    private String email;
    private String password;
    private Date signUpDate;
    private boolean isAdmin;
    private String profileImage;

    public Usuario(int userId, String username, String email, String password, Date signUpDate, boolean isAdmin, String profileImage) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.signUpDate = signUpDate;
        this.isAdmin = isAdmin;
        this.profileImage = profileImage;
    }

    // Constructor sin ID
    public Usuario(String username, String email, String password, Date signUpDate, boolean isAdmin, String profileImage) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.signUpDate = signUpDate;
        this.isAdmin = isAdmin;
        this.profileImage = profileImage;
    }

    /*
    Constructor sin ID, sin contrasenna
     */
    public Usuario(String username, String email, Date signUpDate, boolean isAdmin, String profileImage) {
        this.username = username;
        this.email = email;
        this.signUpDate = signUpDate;
        this.isAdmin = isAdmin;
        this.profileImage = profileImage;
    }

    // Getters y setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getSignUpDate() {
        return signUpDate;
    }

    public void setSignUpDate(Date signUpDate) {
        this.signUpDate = signUpDate;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    @Override
    public String toString() {
        return String.format(
                "{\n"
                + "  \"userId\": %d,\n"
                + "  \"username\": \"%s\",\n"
                + "  \"email\": \"%s\",\n"
                + "  \"password\": \"%s\",\n"
                + "  \"signUpDate\": \"%s\",\n"
                + "  \"isAdmin\": %b,\n"
                + "  \"profileImage\": \"%s\"\n"
                + "}",
                userId,
                escapeJson(username),
                escapeJson(email),
                escapeJson(password),
                signUpDate != null ? signUpDate.toString() : null,
                isAdmin,
                escapeJson(profileImage)
        );
    }

    private String escapeJson(String input) {
        return input == null ? null : input.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
