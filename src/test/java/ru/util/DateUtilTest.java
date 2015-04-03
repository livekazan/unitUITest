package ru.util;

import junit.framework.TestCase;
import org.junit.Test;

public class DateUtilTest extends TestCase {


    @Test
    public void testMillisecToStrDate() throws Exception {
        assertEquals("1 min, 33 sec",DateUtil.nanosecToStrDate(93302427926l));
    }
}