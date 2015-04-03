/**
 * <copyright>
 *
 * Copyright (c) 2011 EcoCompany.ru
 *
 * </copyright>
 */
package ru.action.wraps;

import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @author Admin
 * @version $Rev: $
 */
public final class SpringUtil {
    public static TypedApplicationContext getTestContext(String... contexts) {
        return new TypedApplicationContext(new ClassPathXmlApplicationContext(contexts));
    }
}
