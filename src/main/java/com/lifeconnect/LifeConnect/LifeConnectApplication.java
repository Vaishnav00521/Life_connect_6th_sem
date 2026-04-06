package com.lifeconnect.LifeConnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = {"org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration"})
public class LifeConnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(LifeConnectApplication.class, args);
	}

}
