package ru.action.auth;

import net.tanesha.recaptcha.ReCaptchaImpl;
import net.tanesha.recaptcha.ReCaptchaResponse;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import ru.action.IntegrationActionTestBase;
import ru.action.constant.ActionConstant;
import ru.action.populate.PasswordGenerator;
import ru.action.populate.PopulateUtil;
import ru.model.entity.User;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class LoginActionIntegrationTest extends IntegrationActionTestBase {


    private LoginAction action;
    private String shaPass = PasswordGenerator.generate(6);
    private User user;

    @Before
    public void setUp() throws Exception {
        action = new LoginAction();
        action.setSession(getSession());
        action.setDataService(getDataService());
    }

    @Test
    public void testProcess() throws Exception {
        user = PopulateUtil.popUser(getDataService(), shaPass);
        ReCaptchaResponse reCaptchaResponse = mock(ReCaptchaResponse.class);
        when(reCaptchaResponse.isValid()).thenReturn(true);
        ReCaptchaImpl reCaptcha = mock(ReCaptchaImpl.class);
        when(reCaptcha.checkAnswer("123","123abcd")).thenReturn(reCaptchaResponse);
        action.setReCaptcha(reCaptcha);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addParameter("g-recaptcha-response","123abcd");
        request.setRemoteAddr("123");
        action.setServletRequest(request);
        action.setLogin(user.getLogin());
        action.setPassword(user.getPassword());
        assertEquals(ActionConstant.SUCCESS_OPERATOR, action.process());
    }


}