package ru.util;

import junit.framework.TestCase;

import static ru.util.StringUtil.formatPhoneNumber;

public class StringUtilTest extends TestCase {

    public void testFormatNumberPadRight() throws Exception {

    }

    public void testFormatPhoneNumber() throws Exception {
        assertEquals(formatPhoneNumber("+79272414788"),"9272414788");
        assertEquals(formatPhoneNumber("89272414788"),"9272414788");
        assertEquals(formatPhoneNumber("9272414788"),"9272414788");
        assertEquals(formatPhoneNumber("0272414788"),null);
        assertEquals(formatPhoneNumber("272414788"),null);
        assertEquals(formatPhoneNumber(null),null);
        assertEquals(formatPhoneNumber("sdfsdf"),null);

    }
}