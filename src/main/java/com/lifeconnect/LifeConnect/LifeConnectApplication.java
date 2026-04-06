package com.lifeconnect.LifeConnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
public class LifeConnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(LifeConnectApplication.class, args);
	}

}
