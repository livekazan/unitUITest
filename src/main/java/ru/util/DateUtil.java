package ru.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class DateUtil {
    public static final SimpleDateFormat formatddMMyyyy = new SimpleDateFormat("dd.MM.yyyy");
    public static final SimpleDateFormat formatdd_MM_yyyy = new SimpleDateFormat("dd-MM-yyyy");
    static final long ONE_MINUTE_IN_MILLIS=60000;//millisecs

    public static String dateToStringddMMyyyy(Date date){
        if(date!=null){
            try{
                return formatddMMyyyy.format(date);
            }catch(Exception e){
                return "";
            }
        }else
            return "";
    }

    public static Date stringToDateddMMyyyy(String dateStr){
        if(dateStr!=null && !dateStr.isEmpty()){
            try{
                return formatddMMyyyy.parse(dateStr);
            }catch(Exception e){
                return null;
            }
        }else
            return null;
    }

    public static String dateToStringdd_MM_yyyy(Date date){
        if(date!=null){
            try{
                return formatdd_MM_yyyy.format(date);
            }catch(Exception e){
                return "";
            }
        }else
            return "";
    }

    public static Date addMunites(Date date,int minutes){
        long t=date.getTime();
       return new Date(t + (minutes * ONE_MINUTE_IN_MILLIS));
    }

    public static String nanosecToStrDate(Long millis){
        if(millis==null) return "0";
        return String.format("%d мин, %d сек",
                TimeUnit.NANOSECONDS.toMinutes(millis),
                TimeUnit.NANOSECONDS.toSeconds(millis) -
                        TimeUnit.MINUTES.toSeconds(TimeUnit.NANOSECONDS.toMinutes(millis))
        );

    }


}

