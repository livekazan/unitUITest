/**
 * 
 */
package ru.action.wraps;

import org.apache.log4j.Logger;
import org.junit.Before;
import ru.dataService.DataService;

import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class JunitActionTestBase extends JunitTransactomaticTestBase {
    public static final Logger LOGGER = Logger.getLogger(JunitActionTestBase.class);
    private DataService dataService;
    private ClassLoader loader;
    private Map<String, Object> session;
    private String actionResult;

    @Before
    public void setUp() throws Exception {

        super.setUp();


    }

    public void initDataservices() {
        initContext();
        loader = ClassLoader.getSystemClassLoader();

        dataService = new DataService();
        dataService.setEntityManager(getEntityManager());

        session = new HashMap<String, Object>();
    }

    /* (non-Javadoc)
     * @see ru.ecocompany.ecology.util.TransactomaticTestBase#usedContexts()
     */
	@Override
	public String[] usedContexts() {
		return new String[]{SpringContextName.ACTION_TEST_CONTEXT};
	}


    public Map<String, Object> getSession() {
        return session;
    }

    public void setSession(Map<String, Object> session) {
        this.session = session;
    }


    public ClassLoader getLoader() {
        return loader;
    }

    public void setLoader(ClassLoader loader) {
        this.loader = loader;
    }

    public DataService getDataService() {
        return dataService;
    }

    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }

    public String getActionResult() {
        return actionResult;
    }

    public void setActionResult(String actionResult) {
        this.actionResult = actionResult;
    }
}
