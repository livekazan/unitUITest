/**
 * 
 */
package ru.action;

import junit.framework.Assert;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class JunitActionTestBase extends Assert {
    public static final Logger LOGGER = Logger.getLogger(JunitActionTestBase.class);
    private Map<String, Object> session = new HashMap<String, Object>();

    public Map<String, Object> getSession() {
        return session;
    }

    public void setSession(Map<String, Object> session) {
        this.session = session;
    }
}
