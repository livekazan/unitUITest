package ru.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashingGenerator {

	public final static String typeAlgorithm = "SHA-1";

	/**
	 *
	 * 
	 * @param message
	 * @return
	 * @throws java.security.NoSuchAlgorithmException
	 */
	public static byte[] getDigest(byte[] message) throws NoSuchAlgorithmException {
		MessageDigest messageDigest = MessageDigest.getInstance(typeAlgorithm);
		messageDigest.reset();
		messageDigest.update(message);
		return messageDigest.digest();

	}
	
	public static String generateSHA1(String password) {
		try {
			return String.format("%x", new BigInteger(1, HashingGenerator.getDigest(password.getBytes())));
		}catch(Exception e){
			return "";
		}
	}
}
