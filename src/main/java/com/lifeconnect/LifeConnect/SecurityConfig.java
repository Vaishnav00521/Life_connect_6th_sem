package com.lifeconnect.LifeConnect;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // CRITICAL: Allow pre-flight
                .requestMatchers("/api/**").permitAll() // Web API controllers
                .requestMatchers("/ws-lifeconnect/**").permitAll() // WebSocket connections
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // API documentation
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable());
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        List<String> originPatterns = new ArrayList<>(Arrays.asList(
            "https://*.vercel.app", 
            "http://localhost:5173",
            "http://localhost:5174"
        ));
        
        String renderEnvOrigin = System.getenv("FRONTEND_URL");
        if (renderEnvOrigin != null && !renderEnvOrigin.isBlank()) {
            originPatterns.add(renderEnvOrigin);
        }
        
        // Use origin patterns to avoid allowCredentials conflicts
        config.setAllowedOriginPatterns(originPatterns);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}