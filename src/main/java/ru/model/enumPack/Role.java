package ru.model.enumPack;

/*
* роль пользователя
* */
public enum Role implements Descriptional {
    /** Администратор */
    admin("Администратор"),
    /** Интервьюер */
    operator("Интервьюер");

    private final String description;

    Role(String desc){
    	this.description = desc;
    }

	public String getDescription() {
		return description;
	}
}
