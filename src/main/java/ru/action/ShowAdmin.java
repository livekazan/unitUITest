package ru.action;

import org.apache.log4j.Logger;
import ru.action.base.AdminActionBase;

public class ShowAdmin extends AdminActionBase {
    @Override
    public String process() throws Exception {
        return SUCCESS;
    }

    @Override
    public String getActionMessage() {
        return null;
    }

    @Override
    public Logger getLogger() {
        return null;
    }
}
