package ru.action.populate;

import java.security.SecureRandom;

public class PasswordGenerator {
	// TODO: добавить все спец символы, перетасовать символы + string utils apache commons
	// TODO: раздельный набор символов + если нету цифры и спец символа вставлять случайну цифру и символ на случайную
	// позицию
	// TODO: improve test
	// TODO: introduce password rule
	private static final char[] PASSWORD_CHARS = { 'a', 'b', 'd', 'e', 'f', 'g', 'h', 'k', 'm',
			'n', 'p', 'q', 'r', 's', 't', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
			'J', 'K', 'L', 'M', 'N',  'P', 'R', 'S', 'T', 'X', 'Y', 'Z', '1', '2',
			'3', '4', '5', '6', '7', '8', '9', '!', '@', '_'};
	
	private static final char[] PASSWORD_NUMBERS = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

	public static String generate(final int length) {
		SecureRandom secureRandom = new SecureRandom();
		String password = "";
		for (int i = 0; i < length; i++) {
			password += PASSWORD_CHARS[secureRandom.nextInt(PASSWORD_CHARS.length)];
		}
		return password;

	}
	
	public static String generateNum(final int length) {
		SecureRandom secureRandom = new SecureRandom();
		String password = "";
		for (int i = 0; i < length; i++) {
			password += PASSWORD_NUMBERS[secureRandom.nextInt(PASSWORD_NUMBERS.length)];
		}
		return password;

	}
}
