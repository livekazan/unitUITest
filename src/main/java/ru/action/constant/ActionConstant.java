package ru.action.constant;


import ru.model.json.ErrorMsgJSON;

public interface ActionConstant {

    public static final String M_EMPTY_PARAM = "m1";
    public static final String M_NO_ENTITY = "m2";
    public static final String M_INACTIVE = "m3";
    public static final String M_INVALID_CAPTCHA= "m4";
    public static final String SUCCESS_ADMIN = "s_admin";
    public static final String SUCCESS_OPERATOR = "s_operator";


    public static final ErrorMsgJSON EMPTY_PARAM = new ErrorMsgJSON("Входящие параметры пустые",1);
    public static final ErrorMsgJSON DOCUMENT_STATE = new ErrorMsgJSON("Статус документа не позволяет выполнить данную операцию",2);
    public static final ErrorMsgJSON PARSE = new ErrorMsgJSON("Ошибка преобразования данных",3);
    public static final ErrorMsgJSON NO_ENTITY = new ErrorMsgJSON("Объект не найден в базе данных",4);
    public static final ErrorMsgJSON JSON_PARSE = new ErrorMsgJSON("Ошибка преобразования данных из Json",6);
    public static final ErrorMsgJSON RUNNING_INTERVIEW = new ErrorMsgJSON("Невозможно удалить тест,т.к он исользуется в запущенном опросе",5);
    public static final ErrorMsgJSON ENTITY_EXIST = new ErrorMsgJSON("Объект уже есть в базе данных",7);
    public static final ErrorMsgJSON EXCEPTION = new ErrorMsgJSON("Фатальная ошибка",8);
    public static final ErrorMsgJSON QUOTA = new ErrorMsgJSON("Квотный план в данной категории заполнен",9);
    public static final ErrorMsgJSON NO_CONTACT_TO_CALL = new ErrorMsgJSON("Все респонденты уже опрошены. Обратитесь к руководителю для добавления респондентов.",10);

}
