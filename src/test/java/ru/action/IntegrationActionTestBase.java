/**
 *
 */
package ru.action;

import junit.framework.Assert;
import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;
import ru.dataService.DataService;

import java.util.HashMap;
import java.util.Map;

/**
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:ecologyaction-test-context.xml")
@Transactional
public abstract class IntegrationActionTestBase extends Assert {
    public static final Logger LOGGER = Logger.getLogger(IntegrationActionTestBase.class);
    @Autowired
    private DataService dataService;
    private Map<String, Object> session;
    private ClassLoader loader;


    @Before
    public void setUp() throws Exception {

        loader = ClassLoader.getSystemClassLoader();
        session = new HashMap<String, Object>();

    }

    public DataService getDataService() {
        return dataService;
    }

    public void setDataService(DataService dataService) {
        this.dataService = dataService;
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
}
