package ru.util;

import com.codeborne.selenide.Configuration;
import org.junit.AfterClass;
import org.junit.BeforeClass;

public abstract class AbstractHangmanTest {

  private static Launcher launcher;

  @BeforeClass
  public static void startServer() throws Exception {
    Configuration.baseUrl = "http://localhost:9999";
    launcher = new Launcher(9999);
    launcher.run();
  }

  @AfterClass
  public static void stopServer() {
    if (launcher != null) {
      launcher.stop();
      launcher = null;
    }
  }

  public static void main(String[] args) throws Exception {
    startServer();
  }
}
