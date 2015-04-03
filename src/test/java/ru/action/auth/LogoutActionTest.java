package ru.action.auth;

import com.opensymphony.xwork2.ActionSupport;
import org.junit.Before;
import org.junit.Test;
import ru.action.populate.PasswordGenerator;
import ru.action.wraps.ActionTestBase;
import ru.action.wraps.UnitOfWork;
import ru.model.entity.User;

import static junit.framework.Assert.assertEquals;

public class LogoutActionTest extends ActionTestBase {


    private LogoutAction action;
    private String shaPass = PasswordGenerator.generate(6);
    private User user;

    @Before
    public void setUp() throws Exception {
        super.setUp();

        action = new LogoutAction();
        action.setDataService(getDataService());
        action.setSession(getSession());
        getTransactomatic().perform(new UnitOfWork() {
            public void work() throws Exception {
                setActionResult(action.process());
            }
        });
    }

    @Test
    public void testProcess() throws Exception {
        assertEquals(getActionResult(), ActionSupport.SUCCESS);
    }

    @Test
    public void testNullSession() throws Exception {
        action.setSession(null);
        getTransactomatic().perform(new UnitOfWork() {
            public void work() throws Exception {
                setActionResult(action.process());
            }
        });
        assertEquals(getActionResult(), ActionSupport.ERROR);
    }

}