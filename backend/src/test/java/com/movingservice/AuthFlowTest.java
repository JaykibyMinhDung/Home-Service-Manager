package com.movingservice;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/** Kiểm thử luồng tài khoản và phân quyền qua HTTP, chạy trên CSDL H2 trong bộ nhớ. */
@SpringBootTest
@AutoConfigureMockMvc
class AuthFlowTest {

    private static final String ADMIN_EMAIL = "admin@test.local";
    private static final String ADMIN_PASSWORD = "AdminTest@123";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void registerThenReadProfile() throws Exception {
        String token = register("Nguyễn Văn A", "khach1@test.local", "0901234567", "matkhau123");

        mockMvc.perform(get("/api/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("khach1@test.local"))
                .andExpect(jsonPath("$.fullName").value("Nguyễn Văn A"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    void registerWithExistingEmailIsRejected() throws Exception {
        register("Khách Hai", "khach2@test.local", "0901234568", "matkhau123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson("Người Khác", "KHACH2@test.local", "0901234569", "matkhau456")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email đã được sử dụng"));
    }

    @Test
    void registerWithInvalidDataIsRejected() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson("Khách Ba", "khong-phai-email", "0901234570", "matkhau123")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email không đúng định dạng"));
    }

    @Test
    void loginWithWrongPasswordIsRejected() throws Exception {
        register("Khách Bốn", "khach4@test.local", "0901234571", "matkhau123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson("khach4@test.local", "sai-mat-khau")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email hoặc mật khẩu không đúng"));
    }

    @Test
    void requestWithoutTokenOrWithBadTokenIsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/users/me").header("Authorization", "Bearer khong-phai-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void customerCannotCallStaffOrAdminApi() throws Exception {
        String token = register("Khách Năm", "khach5@test.local", "0901234572", "matkhau123");

        mockMvc.perform(get("/api/admin/staff").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/staff/orders").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void seededAdminCanLoginAndPassAdminAuthorization() throws Exception {
        String token = login(ADMIN_EMAIL, ADMIN_PASSWORD);

        mockMvc.perform(get("/api/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));
        // Đường dẫn chưa có controller: qua được phân quyền thì nhận 404 chứ không phải 403.
        mockMvc.perform(get("/api/admin/chua-co").header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateProfileAndChangePassword() throws Exception {
        String token = register("Khách Sáu", "khach6@test.local", "0901234573", "matkhau123");

        mockMvc.perform(put("/api/users/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Khách Sáu Mới\",\"phone\":\"0911111111\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Khách Sáu Mới"))
                .andExpect(jsonPath("$.phone").value("0911111111"));

        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"oldPassword\":\"sai-mat-khau\",\"newPassword\":\"matkhaumoi\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"oldPassword\":\"matkhau123\",\"newPassword\":\"matkhaumoi\"}"))
                .andExpect(status().isNoContent());

        login("khach6@test.local", "matkhaumoi");
    }

    private String register(String fullName, String email, String phone, String password) throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson(fullName, email, phone, password)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.token");
    }

    private String login(String email, String password) throws Exception {
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson(email, password)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.token");
    }

    private String registerJson(String fullName, String email, String phone, String password) {
        return "{\"fullName\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\",\"password\":\"%s\"}"
                .formatted(fullName, email, phone, password);
    }

    private String loginJson(String email, String password) {
        return "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password);
    }
}
