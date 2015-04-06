import org.junit.Test;
import org.openqa.selenium.By;

import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;

public class LoginPage {

    @Test
    public void visibleButtonLogin(){

        open("/unitTest/login.action");
        $(By.name("login")).setValue("user");
        $(By.name("password")).setValue("1").pressEnter();
        $(By.id("errorMsg")).shouldHave((text("Поля незаполнены")));
    }

}