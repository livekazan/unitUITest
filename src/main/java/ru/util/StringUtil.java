package ru.util;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Field;
import java.util.List;

public class StringUtil {

    public static String formatNumberPadRight(int size,String number){
        return String.format("%-"+size+"s", number).replace(' ', '0');
    }

    public static String formatPhoneNumber(String phoneNumber) {
        if(phoneNumber == null) return null;
        if(phoneNumber.length() >= 10){
            if(phoneNumber.substring(0, 1).equals("9")){
                return phoneNumber;
            } else {
                phoneNumber = phoneNumber.substring(1, phoneNumber.length());
                return formatPhoneNumber(phoneNumber);
            }
        } else {
            return null;
        }

    }

    public static String formatOperatorPrefix(String prefix){
        if(prefix == null) return null;
        if(!prefix.startsWith("9")) return null;
        return prefix;
    }

    public static String removeAllWhiteSpaces(String str){
        if(str!=null){
            return str.replaceAll("\\s+","");
        }
        return str;
    }

    public static String trim(String str){
        if(str==null) return null;
        return str.trim();
    }

    public static String concatWithDelimiterCapitalize(List objectList,String fieldName,String delimetr){
        StringBuilder builder = new StringBuilder();
        try {
            for(Object x : objectList) {
                Field field = getField(x.getClass(),fieldName);
                if(field==null) break;
                field.setAccessible(true);
                Object fieldValue = field.get(x);
                builder.append(StringUtils.capitalize(ConverterUtil.toString(fieldValue))).append(delimetr);
            }
            if(builder.length()>1){
                builder.delete(builder.length()-delimetr.length(),builder.length());
            }
        }catch(Exception e){

        }
        return builder.toString();
    }

    private static Field getField (Class c,String fieldName){
        if(c==null) return null;
        Field field = null;
        try {
            field = c.getDeclaredField(fieldName);
        }catch(Exception e){
        }
        if(field==null) return getField(c.getSuperclass(),fieldName);
        return field;
    }



}
