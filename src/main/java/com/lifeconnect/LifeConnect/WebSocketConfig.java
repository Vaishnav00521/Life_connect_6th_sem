package com.lifeconnect.LifeConnect;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    private final Environment env;

    public WebSocketConfig(Environment env) {
        this.env = env;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        boolean isProd = Arrays.asList(env.getActiveProfiles()).contains("prod");

        if (isProd) {
            // Production: only allow Vercel + explicit FRONTEND_URL
            registry.addEndpoint("/ws-lifeconnect")
                    .setAllowedOriginPatterns("https://*.vercel.app", frontendUrl)
                    .withSockJS();
        } else {
            // Development: allow all + localhost
            registry.addEndpoint("/ws-lifeconnect")
                    .setAllowedOriginPatterns("*", frontendUrl)
                    .withSockJS();
        }
    }
}