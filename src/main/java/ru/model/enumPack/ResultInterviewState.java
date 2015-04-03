package ru.model.enumPack;

/* статусы опросов */
public enum ResultInterviewState implements Descriptional {
    /** Запущен */
    isRunning("Запущен"),
    isNoContactAnswered("Респондент не ответил"),
    isContactInadequate("Респондент невменяемый"),
    isContactRefused("Респондент не захотел проходить опрос"),
    isQuotaOverflow("Квотный план в данной категории заполнен"),
    other("Другое"),
	/** Окончен */
    isEnded("Окончен");

    private final String description;

    ResultInterviewState(String desc){
    	this.description = desc;
    }

	public String getDescription() {
		return description;
	}
}
