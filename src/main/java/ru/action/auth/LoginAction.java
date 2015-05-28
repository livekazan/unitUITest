package ru.action.auth;

import net.tanesha.recaptcha.ReCaptchaImpl;
import net.tanesha.recaptcha.ReCaptchaResponse;
import org.apache.log4j.Logger;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.springframework.beans.factory.annotation.Autowired;
import ru.action.base.CommonActionBase;
import ru.action.constant.ActionConstant;
import ru.action.constant.SessionConstant;
import ru.model.entity.User;
import ru.model.enumPack.Role;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Логин в систему
 *
 */
public class LoginAction extends CommonActionBase implements ServletRequestAware {
    private static final Logger LOGGER = Logger.getLogger(LoginAction.class);
    private String login;
    private String password;
    private HttpServletRequest request;
    @Autowired
    private ReCaptchaImpl reCaptcha;


    @Override
    public String process() throws Exception {

        if(!checkParam(login,password,request)) return ActionConstant.M_EMPTY_PARAM;

        ReCaptchaResponse response = reCaptcha.checkAnswer(request.getRemoteAddr(),request.getParameter("g-recaptcha-response"));

        if (!response.isValid()) {
            return ActionConstant.M_INVALID_CAPTCHA;
        }

        //поиск
        User user  = getDataService().findUser(login, password);

        if(!checkUser(user)) return ActionConstant.M_NO_ENTITY;

        if(!isActiveUser(user)) return ActionConstant.M_INACTIVE;

        setSession(addToSession(getSession(), user));

        if(user.getRole().equals(Role.admin)){
            return ActionConstant.SUCCESS_ADMIN;
        }else{
            return ActionConstant.SUCCESS_OPERATOR;
        }

    }

    public Map<String, Object> addToSession(Map<String, Object> session,User user) {
        //добавление в сессию
        if(session!=null){
            session.put(SessionConstant.USER, user);
        }
        return session;
    }

    public boolean checkUser(User user) {
        if( user == null || user.getRole() ==null){
            return false;
        }
        return true;
    }

    public boolean isActiveUser(User user) {
        return user.isActive();
    }

    public boolean checkParam(String login,String password,HttpServletRequest request) {
        if(login==null || login.isEmpty()
                || password==null || password.isEmpty()
                || request==null || request.getParameter("g-recaptcha-response")==null || request.getParameter("g-recaptcha-response").isEmpty()){
            return false;
        }
        return true;
    }

    @Override
    public String getActionMessage() {
        return null;
    }

    @Override
    public Logger getLogger() {
        return LOGGER;
    }


    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ReCaptchaImpl getReCaptcha() {
        return reCaptcha;
    }

    public void setReCaptcha(ReCaptchaImpl reCaptcha) {
        this.reCaptcha = reCaptcha;
    }

    public void setServletRequest(HttpServletRequest request) {
        this.request = request;
    }

    public HttpServletRequest getServletRequest() {
        return this.request;
    }

    public boolean checkPasswordLength(String password, int givenSize) {
        if(password!=null && password.length()>givenSize) return true;
        return false;
    }
}
