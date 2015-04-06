import org.junit.Test;
import org.openqa.selenium.By;

import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;

public class LoginPage{

    @Test
    public void visibleButtonLogin(){
        open("http://uitest.com:8080/unitTest/login.action");
        $(By.name("login")).setValue("user");
        $(By.id("recaptcha-anchor")).click();
        $(By.name("password")).setValue("1").pressEnter();
    }
}