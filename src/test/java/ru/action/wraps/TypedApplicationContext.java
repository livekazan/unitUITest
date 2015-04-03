package ru.action.wraps;

import org.springframework.context.ConfigurableApplicationContext;

public class TypedApplicationContext {

    private final ConfigurableApplicationContext context;

    public TypedApplicationContext(ConfigurableApplicationContext context) {
        this.context = context;
    }

    public <T> T bean(Class<T> clazz, String name) {
        Object thing = context.getBean(name);
        try {
            return clazz.cast(thing);
        } catch (ClassCastException e) {
            throw new Defect("Tried to cast a " + thing.getClass() + " to " + clazz, e);
        }
    }

    public void close() {
        context.close();
    }
}
