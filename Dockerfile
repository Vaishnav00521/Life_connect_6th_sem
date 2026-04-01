# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# This runs maven to compile your code
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# This copies the compiled .jar file from Stage 1
COPY --from=build /app/target/*.jar app.jar
# Expose the standard web port
EXPOSE 8080
# Boot up the server
ENTRYPOINT ["java", "-jar", "app.jar"]