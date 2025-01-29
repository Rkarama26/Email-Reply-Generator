# Use the official OpenJDK 17 runtime as the base image
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml file and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

#copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

#Use an official Openjdk image to run the application
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

#Copy the built JAR file from the build stage
COPY --from=build /app/target/email-writer-0.0.1-SNAPSHOT.jar .

# Expose the port on which the Spring Boot application runs
EXPOSE 8080


# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/target/email-writer-0.0.1-SNAPSHOT.jar"]
