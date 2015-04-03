package ru.action.wraps;

/**
 * This defect to be used where we know there is a bug in the software. NOT to be used when there are environmental
 * problems.
 * <p/>
 * DO NOT CATCH THIS EXCEPTION - unless you need to report it. let it bubble out
 * <p/>
 * Compare with
 *
 * @see EnvironmentException
 */
public class Defect extends RuntimeException {
    /**
     *
     */
    private static final long serialVersionUID = 6075987504679361174L;

    public Defect(String message) {
        super(message);
    }

    public Defect(String message, Throwable cause) {
        super(message, cause);
    }
}
