package ru.action.auth;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import ru.action.JunitActionTestBase;
import ru.action.constant.SessionConstant;
import ru.action.populate.PasswordGenerator;
import ru.model.entity.User;
import ru.model.enumPack.Role;

import java.util.HashMap;
import java.util.Map;

public class LoginActionTest extends JunitActionTestBase {


    private LoginAction action;
    private String shaPass = PasswordGenerator.generate(6);
    private User user;

    @Before
    public void setUp() throws Exception {
        action = new LoginAction();
        action.setSession(getSession());
    }

    @Test
    public void testParamsNullLogin() throws Exception {
        String password ="myPasswordHash";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addParameter("g-recaptcha-response","123abcd");
        assertEquals(false, action.checkParam(null, password, request));
    }

    @Test
    public void testParamsNullRequest() throws Exception {
        String password ="myPasswordHash";
        assertEquals(false, action.checkParam(null, password, null));
    }

    @Test
    public void testParams() throws Exception {
        String login = "myLogin";
        String password ="myPasswordHash";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addParameter("g-recaptcha-response", "123abcd");
        assertEquals(true, action.checkParam(login, password, request));
    }

    @Test
    public void testCheckUser() throws Exception {
        user= new User();
        user.setRole(Role.admin);
        assertEquals(true, action.checkUser(user));
    }

    @Test
    public void testCheckUserNull() throws Exception {
        user= null;
        assertEquals(false, action.checkUser(user));
    }

    @Test
    public void testCheckUserRoleNull() throws Exception {
        user=new User();
        user.setRole(null);
        assertEquals(false, action.checkUser(user));
    }

    @Test
    public void testIsActiveUser() throws Exception {
        user=new User();
        user.setActive(true);
        assertEquals(true, action.isActiveUser(user));
    }

    @Test
    public void testAddToSession() throws Exception {
        user=new User();
        user.setActive(true);
        user.setRole(Role.admin);
        Map<String, Object> sessionTest = new HashMap<>();
        sessionTest.put(SessionConstant.USER, user);
        assertEquals(sessionTest, action.addToSession(new HashMap<>(), user));
    }

    @Test
    public void testPasswordMoreGiven() throws Exception {
        int givenSize = 6;
        assertTrue(action.checkPasswordLength("1234567",givenSize));
    }

    @Test
    public void testPasswordLengthNull() throws Exception {
        int givenSize = 6;
        assertFalse(action.checkPasswordLength(null, givenSize));
    }

}