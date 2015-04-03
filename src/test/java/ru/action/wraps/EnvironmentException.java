package ru.action.wraps;

/**
 * To be used (create an appropriate subclass if required) where something in the environment is not as we expect. e.g.
 * - Remote Web Service Not Available / Failed - Database Not Available - Server didn't start up Not to be used for
 * application bugs Not to be used for data ingress validation failures
 *
 * @see Defect
 */
public class EnvironmentException extends Exception {
    /**
     *
     */
    private static final long serialVersionUID = 2004514700800335768L;

    public EnvironmentException(String message) {
        super(message);
    }

    public EnvironmentException(String message, Throwable cause) {
        super(message, cause);
    }
}
