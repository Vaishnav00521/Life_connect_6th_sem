package com.lifeconnect.LifeConnect;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.core.Ordered;

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

    // ════════════════════════════════════════════════════════
    // FIX 1: Register CORS filter at HIGHEST priority.
    // This ensures preflight OPTIONS requests are handled
    // BEFORE Spring Security blocks them with a 403.
    // ════════════════════════════════════════════════════════
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        FilterRegistrationBean<CorsFilter> bean =
                new FilterRegistrationBean<>(new CorsFilter(corsConfigurationSource()));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE); // Run before Security
        return bean;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // FIX 2: Use the corsConfigurationSource bean directly
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // FIX 3: CSRF disabled — this is a stateless REST API
            .csrf(csrf -> csrf.disable())
            // FIX 4: Stateless session — no cookies/sessions needed
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow all preflight OPTIONS requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Public API endpoints — no login required
                .requestMatchers("/api/**").permitAll()
                // WebSocket
                .requestMatchers("/ws-lifeconnect/**").permitAll()
                // Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // Everything else requires auth
                .anyRequest().authenticated()
            )
            // Disable Spring's default login pages
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        List<String> originPatterns = new ArrayList<>();
        boolean isProd = Arrays.asList(env.getActiveProfiles()).contains("prod");

        if (isProd) {
            originPatterns.add("https://*.vercel.app");
            if (frontendUrl != null && !frontendUrl.isBlank()) {
                originPatterns.add(frontendUrl);
            }
        } else {
            // DEV: allow localhost
            originPatterns.add("http://localhost:5173");
            originPatterns.add("http://localhost:5174");
            originPatterns.add("http://localhost:3000");
            originPatterns.add("https://*.vercel.app");
            if (frontendUrl != null && !frontendUrl.isBlank()) {
                originPatterns.add(frontendUrl);
            }
        }

        config.setAllowedOriginPatterns(originPatterns);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // FIX 5: Explicitly list headers that the browser sends
        config.setAllowedHeaders(Arrays.asList(
            "Authorization", "Content-Type", "Accept", "Origin",
            "X-Requested-With", "Cache-Control"
        ));
        config.setExposedHeaders(Arrays.asList("Authorization"));
        config.setAllowCredentials(true);
        // FIX 6: Cache preflight for 1 hour (reduces OPTIONS calls)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}