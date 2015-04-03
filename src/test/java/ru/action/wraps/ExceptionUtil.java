package ru.action.wraps;

import java.io.PrintWriter;
import java.io.StringWriter;

public class ExceptionUtil {
    public static Throwable rootCauseOf(Throwable e) {
        Throwable cause = e;
        while (hasCause(cause)) {
            cause = cause.getCause();
        }
        return cause;
    }

    private static boolean hasCause(Throwable e) {
        return e.getCause() != null && e.getCause() != e;
    }

    public static String stackTraceFor(Throwable e) {
        StringWriter writer = new StringWriter();
        e.printStackTrace(new PrintWriter(writer));
        return writer.toString();
    }

    public static String getCurrentStackTrace() {
        try {
            throw new Exception("[ExceptionUtil::getCurrentStackTrace] It is thrown to be caught just after throwing.");
        } catch (Throwable t) {
            return stackTraceFor(t);
        }
    }
}
