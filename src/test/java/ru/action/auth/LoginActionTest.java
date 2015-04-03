package ru.action.auth;

import org.junit.Before;
import org.junit.Test;
import ru.action.constant.ActionConstant;
import ru.action.populate.PasswordGenerator;
import ru.action.populate.PopulateUtil;
import ru.action.wraps.ActionTestBase;
import ru.action.wraps.UnitOfWork;
import ru.model.entity.User;

import static junit.framework.Assert.assertEquals;

public class LoginActionTest extends ActionTestBase {


    private LoginAction action;
    private String shaPass = PasswordGenerator.generate(6);
    private User user;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        getTransactomatic().perform(new UnitOfWork() {
            public void work() throws Exception {
                user = PopulateUtil.popUser(getDataService(), shaPass);
            }
        });

        action = new LoginAction();
        action.setDataService(getDataService());
        action.setLogin(user.getLogin());
        action.setPassword(shaPass);
        action.setSession(getSession());
        getTransactomatic().perform(new UnitOfWork() {
            public void work() throws Exception {
                setActionResult( action.process());
            }
        });
    }

    @Test
    public void testProcess() throws Exception {
        assertEquals(getActionResult(), ActionConstant.SUCCESS_OPERATOR);
    }

    @Test
    public void testInactive() throws Exception {
        getTransactomatic().perform(new UnitOfWork() {
            public void work() throws Exception {
                user.setActive(false);
                getDataService().save(user);
            }
        });

        getTransactomatic().perform(new UnitOfWork() {
            public void work() throws Exception {
                setActionResult(action.process());
            }
        });
        assertEquals(getActionResult(),ActionConstant.M_INACTIVE);

    }


    @Test
    public void testEmtyParam() throws Exception {
       action.setLogin(null);
        action.setPassword("");

        getTransactomatic().perform(new UnitOfWork() {
            public void work() throws Exception {
                setActionResult(action.process());
            }
        });
        assertEquals(getActionResult(),ActionConstant.M_EMPTY_PARAM);

    }

    @Test
    public void testNOENTITY() throws Exception {
        action.setPassword("dfgdfgdfgdfgdfgdfgdfgdfgdgdfgdfgdgdfgdfg 54 4 55 4 4 4 4 5");

        getTransactomatic().perform(new UnitOfWork() {
            public void work() throws Exception {
                setActionResult(action.process());
            }
        });
        assertEquals(getActionResult(),ActionConstant.M_NO_ENTITY);

    }


}