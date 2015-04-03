package ru.action.auth;

import org.apache.log4j.Logger;
import ru.action.base.CommonActionBase;

/**
 * Выход из системы
 *
 */
public class LogoutAction extends CommonActionBase {
    private static final Logger LOGGER = Logger.getLogger(LogoutAction.class);

    @Override
    public String process() throws Exception {
        if(getSession()==null) return ERROR;

        if (getSession() instanceof org.apache.struts2.dispatcher.SessionMap) {
            try {
                ((org.apache.struts2.dispatcher.SessionMap) getSession()).invalidate();
                return SUCCESS;
            } catch (IllegalStateException e) {
                LOGGER.error("Logout ex:",e);
                return ERROR;
            }
        }
        return SUCCESS;
    }

    @Override
    public String getActionMessage() {
        return null;
    }

    @Override
    public Logger getLogger() {
        return LOGGER;
    }

}
