package ru.util;

import java.util.Random;

public class JCommonUtil {

    public static Integer randInt(int min, int max) {
        Random rand = new Random();
        Integer randomNum = rand.nextInt((max - min) + 1) + min;
        return randomNum;
    }

    public static double randDouble(int min, int max) {
        Random rand = new Random();
        double randomNum = min + (max-min)*rand.nextDouble();
        return randomNum;
    }
}
