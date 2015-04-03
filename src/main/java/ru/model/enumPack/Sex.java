package ru.model.enumPack;

/**
 * пол Респондента
 */
public enum Sex implements Descriptional {
    male("мужской"),
    female("женский");

    private final String description;

    Sex(String desc){
    	this.description = desc;
    }

	public String getDescription() {
		return description;
	}
}
