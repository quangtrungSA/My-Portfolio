# ============================
# Stage 1: Build
# ============================
FROM gradle:8-jdk21-alpine AS build

WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
RUN chmod +x gradlew

# Download dependencies first (cacheable layer)
RUN ./gradlew dependencies --no-daemon || true

# Copy source and build
COPY src ./src
RUN ./gradlew build -x test --no-daemon
# Rename executable jar (exclude -plain.jar) for easy COPY in stage 2
RUN find /app/build/libs -name "*.jar" ! -name "*-plain.jar" | head -1 | xargs -I{} cp {} /app/build/libs/app.jar

# ============================
# Stage 2: Run
# ============================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/build/libs/app.jar app.jar

# Change ownership
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/profiles || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
