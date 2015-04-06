package ru.action.auth;

import org.junit.Test;
import org.openqa.selenium.By;

import static com.codeborne.selenide.CollectionCondition.size;
import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selenide.*;

public class LoginPageTest {

    @Test
    public void visibleButtonLogin(){
        open("http://uitest.com:8080/unitTest/login.action");
        $(By.name("login")).setValue("user");
        $(By.name("password")).setValue("1").pressEnter();
        $(By.id("errorMsg")).shouldHave((text("Поля незаполнены")));
    }

    @Test
    public void userCanSearchAnyKeyword() {
        open("http://google.com/en");
        $(By.name("q")).val("selenide").pressEnter();
        $$("#ires li.g").shouldHave(size(10));
        $("#ires li.g").shouldHave(text("selenide.org"));
    }
}