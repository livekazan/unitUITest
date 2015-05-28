import org.junit.Test;
import org.openqa.selenium.By;

import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;

public class LoginPage {

    @Test
    public void visibleButtonLogin(){
        open("/unitUITest/login");
        $(By.name("login")).setValue("user");
        $(By.name("password")).setValue("1").pressEnter();
        $(By.id("errorMsg")).shouldHave((text("Поля незаполнены")));
    }

    @Test
    public void emptyPassword(){
        open("/unitUITest/login");
        $(By.name("login")).setValue("user").pressEnter();
        $(By.id("errorMsg")).shouldHave((text("Заполните все поля!")));
    }


    @Test
    public void emptyLogin(){
        open("/unitUITest/login");
        $(By.name("password")).setValue("1").pressEnter();
        $(By.id("errorMsg")).shouldHave((text("Заполните все поля!")));
    }

    @Test
    public void allEmpty(){
        open("/unitUITest/login");
        $(By.name("password")).setValue("").pressEnter();
        $(By.id("errorMsg")).shouldHave((text("Заполните все поля!")));
    }


}