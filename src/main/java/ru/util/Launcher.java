package ru.util;

import org.eclipse.jetty.annotations.AnnotationConfiguration;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.WebAppContext;

import java.io.File;

public class Launcher {
  private static final int DEFAULT_PORT = 8080;
  private static final String CONTEXT_PATH = "/";
  private static final String CONFIG_LOCATION = "eu.kielczewski.example.config";
  private static final String MAPPING_URL = "/*";
  private static final String DEFAULT_PROFILE = "dev";
  private final int port;
  private final Server server;

  public Launcher(int port) {
    this.port = port;
    server = new Server(port);
  }

  public Launcher run() throws Exception {
    System.out.println("Start jetty launcher at " + port);
    System.out.println("Start hangman webapp at " + new File("webapp").getAbsolutePath());


    WebAppContext webAppContext = new WebAppContext();
    webAppContext.setResourceBase("/webapp");
    webAppContext.setContextPath("/");
    webAppContext.setConfigurations(new Configuration[] { new AnnotationConfiguration() });
    webAppContext.setParentLoaderPriority(true);

    server.setHandler(webAppContext);
    server.start();
    server.join();
    return this;
  }


  private void addShutdownHook() {
    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run() {
        Launcher.this.stop();
      }
    });
  }

  public final void stop() {
    try {
      System.out.println("Shutdown jetty launcher at " + port);
      server.stop();
    } catch (Exception ignore) {
    }
  }

  public static void main(String[] args) throws Exception {
    new Launcher(8080).run();
  }
}