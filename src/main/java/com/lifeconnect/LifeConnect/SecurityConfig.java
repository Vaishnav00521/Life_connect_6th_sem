package com.lifeconnect.LifeConnect;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
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

    @Value("${FRONTEND_URL:}")
    private String frontendUrl;

    private final Environment env;

    public SecurityConfig(Environment env) {
        this.env = env;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/ws-lifeconnect/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        List<String> originPatterns = new ArrayList<>();

        // Check which Spring profile is active
        boolean isProd = Arrays.asList(env.getActiveProfiles()).contains("prod");

        if (isProd) {
            // ──── PRODUCTION: Only allow Vercel + explicit FRONTEND_URL ────
            // No localhost allowed in production for security.
            originPatterns.add("https://*.vercel.app");
            if (frontendUrl != null && !frontendUrl.isBlank()) {
                originPatterns.add(frontendUrl);
            }
        } else {
            // ──── DEVELOPMENT: Allow localhost for local dev ────
            originPatterns.add("http://localhost:5173");
            originPatterns.add("http://localhost:5174");
            originPatterns.add("https://*.vercel.app");
            if (frontendUrl != null && !frontendUrl.isBlank()) {
                originPatterns.add(frontendUrl);
            }
        }

        config.setAllowedOriginPatterns(originPatterns);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}