# ╔══════════════════════════════════════════════════════════════╗
# ║  LifeConnect — Optimized Multi-Stage Docker Build          ║
# ║  Stage 1: Maven build → Stage 2: Lightweight JRE runner    ║
# ╚══════════════════════════════════════════════════════════════╝

# ──── STAGE 1: Build the .jar ────
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /build

# 1. Copy only the pom.xml first to cache Maven dependencies.
#    This layer is cached unless pom.xml changes, saving ~3min per rebuild.
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# 2. Copy the source code and compile.
COPY src ./src
RUN ./mvnw clean package -DskipTests -Dspring.profiles.active=prod -B


# ──── STAGE 2: Run the .jar on a minimal JRE ────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Security: don't run as root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the compiled .jar from Stage 1
COPY --from=build /build/target/*.jar app.jar

# Render uses the PORT env variable. Default to 8080.
ENV PORT=8080
EXPOSE ${PORT}

# JVM flags for containers: respect memory limits, faster startup
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dspring.profiles.active=prod", \
  "-Dserver.port=${PORT}", \
  "-jar", "app.jar"]