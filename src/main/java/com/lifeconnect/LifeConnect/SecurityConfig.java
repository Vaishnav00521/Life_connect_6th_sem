package com.lifeconnect.LifeConnect;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.core.Ordered;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // ════════════════════════════════════════════════════════
    // Register CORS filter at HIGHEST priority.
    // This ensures preflight OPTIONS requests are handled
    // BEFORE Spring Security blocks them.
    // ════════════════════════════════════════════════════════
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        FilterRegistrationBean<CorsFilter> bean =
                new FilterRegistrationBean<>(new CorsFilter(corsConfigurationSource()));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. CORS must be first
            .cors(c -> c.configurationSource(corsConfigurationSource()))
            
            // 2. Explicitly disable CSRF for stateless REST API
            .csrf(AbstractHttpConfigurer::disable)
            
            // 3. Stateless session policy
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Endpoint Authorization
            .authorizeHttpRequests(auth -> auth
                // Allow all preflight OPTIONS requests globally
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Explicitly whitelist the registration and health endpoints
                .requestMatchers("/api/registration/**", "/api/health").permitAll()
                
                // Allow other API usages (if any public, keep it open)
                .requestMatchers("/api/**").permitAll()
                
                // WebSocket and UI Documentations
                .requestMatchers("/ws-lifeconnect/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Require auth for anything else remaining
                .anyRequest().authenticated()
            )
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Must explicitly include EXACT origins when allowCredentials is true
        config.setAllowedOrigins(Arrays.asList(
            "https://lifeconnect-kappa.vercel.app",
            "http://localhost:5173"
        ));

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*")); // Allow all headers
        config.setAllowCredentials(true);             // Crucial for cross-origin POSTs

        // Optional: Cache preflight requests for 1 hour to reduce network traffic
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}