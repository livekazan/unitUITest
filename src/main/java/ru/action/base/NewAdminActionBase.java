package ru.action.base;

import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.interceptor.SessionAware;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.transaction.annotation.Transactional;
import ru.action.constant.SessionConstant;
import ru.dataService.DataService;
import ru.model.entity.User;
import ru.model.enumPack.Role;

import java.io.IOException;
import java.util.Map;

public abstract class NewAdminActionBase extends ActionSupport implements SessionAware {

    private static final Logger LOGGER = Logger.getLogger(NewAdminActionBase.class);
    private Map<String, Object> session;
    private DataService dataService;
    protected String result;

    public NewAdminActionBase() {
    }

    public NewAdminActionBase(DataService dataService) {
        this.dataService = dataService;
    }

    @Transactional(rollbackFor = Exception.class)
    public String index() throws Exception {
        return entryPoint();
    }

    @Transactional(rollbackFor = Exception.class)
    public String execute() throws Exception {
        return entryPoint();
    }

    protected String entryPoint() throws IOException {
        String sessionString = "";
        try {
            if(session != null && session.get(SessionConstant.USER) != null){
                User user = (User) session.get(SessionConstant.USER);
                if(user != null){
                    sessionString = "LOGIN (" + user.getLogin() + "): ";
                    if(user.getRole() != null && !user.getRole().equals(Role.admin)){
                        LOGGER.info(sessionString + this.getClass().getSimpleName().toString());
                        return ERROR;
                    }
                    sessionString = "LOGIN (" + user.getLogin() + "): ";
                }
            }

            LOGGER.info(sessionString + this.getClass().getSimpleName().toString());
            return process();
        } catch(ConstraintViolationException e){
            getLogger().info(getActionMessage(), e);
            return ERROR;
        } catch(Exception e){
            getLogger().error(getActionMessage(), e);
            return ERROR;
        }

    }

    public abstract String process() throws Exception;

    public abstract String getActionMessage();

    public abstract Logger getLogger();


    public Map<String, Object> getSession() {
        return session;
    }

    public void setSession(Map<String, Object> session) {
        this.session = session;
    }

    public DataService getDataService() {
        return dataService;
    }

    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

}
