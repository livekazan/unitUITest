package ru.util;

import junit.framework.TestCase;
import org.junit.Test;

public class DateUtilTest extends TestCase {


    @Test
    public void testMillisecToStrDate() throws Exception {
        assertEquals("1 мин, 33 сек",DateUtil.nanosecToStrDate(93302427926l));
    }
}