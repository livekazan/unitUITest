package ru.util;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class ConverterUtil {
	
	public static final SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");
	public static final String startDateStr = "01.01.1989";
	final static double EPSILON = 0.00000001;



	public static double BigDecimaltoDouble(BigDecimal bigDecimal){
		if(bigDecimal!=null){
			return bigDecimal.doubleValue();
		}else{
			return 0d;
		}
	}
	
	public static BigDecimal safeAdd(BigDecimal bigDecimal){
		if(bigDecimal==null) return BigDecimal.ZERO;
		return bigDecimal;
	}

    public static String parseToString(Object obj){
        if(obj==null) return  null;
        try{
            if(obj instanceof String) return (String)obj;
            else if(obj instanceof Long) return ((Long)obj).toString();
            else if(obj instanceof Integer) return ((Integer)obj).toString();
            else if(obj instanceof Double) return ((Double)obj).toString();
            else if(obj instanceof BigInteger) return ((BigInteger)obj).toString();
            else return null;
        }catch(Exception e){
            return null;
        }
    }

    public static Long parseToLong(Object obj){
        if(obj==null) return  null;
        try{
            if(obj instanceof String) return Long.parseLong((String) obj);
            else if(obj instanceof Long) return (Long)obj;
            else if(obj instanceof Integer) return new Long((Integer)obj);
            else if(obj instanceof Double) return ((Double)obj).longValue();
            else if(obj instanceof BigInteger) return ((BigInteger)obj).longValue();
            else return null;
        }catch(Exception e){
            return null;
        }
    }

    public static Double parseToDouble(Object obj){
        if(obj==null) return  null;
        try{
            if(obj instanceof Double) return (Double)obj;
            else if(obj instanceof String) return Double.parseDouble((String) obj);
            else if(obj instanceof Long) return ((Long)obj).doubleValue();
            else if(obj instanceof Integer) return ((Integer)obj).doubleValue();
            else if(obj instanceof BigInteger) return ((BigInteger)obj).doubleValue();
            else return null;
        }catch(Exception e){
            return null;
        }
    }
    public static Integer parseToInt(Object obj){
        if(obj==null) return  null;
        try{
            if(obj instanceof Integer) return ((Integer)obj);
            else if(obj instanceof String) return Integer.parseInt((String) obj);
            else if(obj instanceof Long) return ((Long)obj).intValue();
            else if(obj instanceof Double) return ((Double)obj).intValue();
            else if(obj instanceof BigInteger) return ((BigInteger)obj).intValue();
            else return null;
        }catch(Exception e){
            return null;
        }
    }

	
	public static BigDecimal parseToBigDecimal(String str){
		try{
			return new BigDecimal(str);
		}catch(Exception e){
			return null;
		}
	}
	
	public static BigDecimal doubleToBigDecimal(Double arg){
		try{
			return new BigDecimal(arg);
		}catch(Exception e){
			return null;
		}
	}
	
	public static Date parseDate(String strDate){
		String date = strDate;
		/*
		 * Преобразуем дату вида 07.04.14 к виду 07.04.2014.
		 */
		if(strDate != null && strDate.length() == 8){
			date = strDate.substring(0, 6) + "20" + strDate.substring(6); 
		}
		try{
			return format.parse(date);
		}catch(Exception e){
			try {
				return format.parse(startDateStr);
			} catch (ParseException e1) {
				// TODO Auto-generated catch block
				return null;
			}
		}
	}
	public static String longToString(Long value){
		return value!=null ? value.toString() : null;
	}
	
	public static boolean isItOkato(Long okato){
		return isItOkato(longToString(okato));
	}
	public static boolean isItOktmo(Long oktmo){
		return isItOktmo(longToString(oktmo));
	}
	
	public static boolean isItOkato(String okato){
		if(okato!=null && (okato.startsWith("922") || okato.startsWith("924"))){
			return true;
		}
		return false;
	}
	
	public static boolean isItOktmo(String oktmo){
		if(oktmo!=null && (oktmo.startsWith("926") || oktmo.startsWith("927"))){
			return true;
		}
		return false;
	}
	
	public static String toString(Object str){
		if(str==null) return null;
		return str.toString();
	}
	
	public static int booleanToInt(boolean bool){
		if(bool) return 1;
			else return 0;
	}

	public static String fromCp1251To866(String str){
		if(str==null) return null;
		try {
			return new String(str.getBytes("Cp1251"), "866");
		} catch (UnsupportedEncodingException e) {
			return null;
		}
	}
	
	public static String getMeasure(String str){
		return str!=null && !str.isEmpty() ? str:"т";
	}


    public static String ArraytoString(List<String> list){

        StringBuilder builder = new StringBuilder() ;

        for (String s : list)
        {
            builder.append(s).append(", ");
        }
        if(builder.length()>0){
            builder.delete(builder.length()-2, builder.length());
        }

       return builder.toString();
    }

	public static boolean equals(double a, double b) {
		if (a==b) return true;
		return Math.abs(a - b) < EPSILON * Math.max(Math.abs(a), Math.abs(b));
	}

}
