package ru.model.enumPack;

/* статусы опросов */
public enum InterviewState implements Descriptional {
    /** Черновик */
    isEdited("Черновик"),
    /** Запущен */
    isRunning("Запущен"),
	/** Окончен */
    isEnded("Окончен"),
    isDeleted("Удален");

    private final String description;

    InterviewState(String desc){
    	this.description = desc;
    }

	public String getDescription() {
		return description;
	}
}
