package ru.model.enumPack;

public enum DocumentState implements Descriptional {
    /** Черновик */
    isEdited("Черновик"),
    /** Утвержден */
    isConfirm("Завершен"),
	/** Удален */
    isDeleted("Удален");

    private final String description;

    DocumentState(String desc){
    	this.description = desc;
    }

	public String getDescription() {
		return description;
	}
}
