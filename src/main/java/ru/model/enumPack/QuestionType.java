package ru.model.enumPack;

/*
* Тип вопросов
*
* */
public enum QuestionType implements Descriptional {
    single("1 ответ"),
    multiple("любое число ответов"),
    tree("вопрос с фильтром"),
    sex("пол"),
    age("возраст");

    private final String description;

    QuestionType(String desc){
    	this.description = desc;
    }

	public String getDescription() {
		return description;
	}
}
