package com.portfolio.config;

import com.portfolio.entity.Profile;
import com.portfolio.entity.User;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed default admin user
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@portfolio.com")
                    .passwordHash(passwordEncoder.encode("changeme"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            logger.warn("================================================");
            logger.warn("  DEFAULT ADMIN CREATED");
            logger.warn("  Username: admin");
            logger.warn("  Password: changeme");
            logger.warn("  PLEASE CHANGE THIS PASSWORD IMMEDIATELY!");
            logger.warn("================================================");
        }

        // Seed default profile
        if (profileRepository.count() == 0) {
            Profile profile = Profile.builder()
                    .name("Your Name")
                    .title("Full Stack Developer")
                    .bio("Welcome to my portfolio! I'm a passionate developer who loves building modern web applications.")
                    .location("Vietnam")
                    .email("hello@portfolio.com")
                    .githubUrl("https://github.com")
                    .linkedinUrl("https://linkedin.com")
                    .build();
            profileRepository.save(profile);
            logger.info("Default profile created");
        }
    }
}
