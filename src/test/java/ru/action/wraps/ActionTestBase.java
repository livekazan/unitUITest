/**
 * 
 */
package ru.action.wraps;

import org.junit.Before;
import ru.dataService.DataService;

import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class ActionTestBase extends TransactomaticTestBase {

    private DataService dataService;
    private ClassLoader loader;
    private String actionResult;
    private Map<String, Object> session = new HashMap<String, Object>();


    @Before
    public void setUp() throws Exception {

        super.setUp();
        loader = ClassLoader.getSystemClassLoader();
        dataService = new DataService();
        dataService.setEntityManager(getEntityManager());
 }
	/* (non-Javadoc)
	 * @see ru.ecocompany.ecology.util.TransactomaticTestBase#usedContexts()
	 */
	@Override
	public String[] usedContexts() {
		return new String[]{SpringContextName.ACTION_TEST_CONTEXT};
	}

    public DataService getDataService() {
        return dataService;
    }

    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }

    public ClassLoader getLoader() {
        return loader;
    }

    public void setLoader(ClassLoader loader) {
        this.loader = loader;
    }

    public Map<String, Object> getSession() {
        return session;
    }

    public void setSession(Map<String, Object> session) {
        this.session = session;
    }

    public String getActionResult() {
        return actionResult;
    }

    public void setActionResult(String actionResult) {
        this.actionResult = actionResult;
    }
}
