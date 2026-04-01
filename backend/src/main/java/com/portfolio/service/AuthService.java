package com.portfolio.service;

import com.portfolio.dto.request.LoginRequest;
import com.portfolio.dto.response.AuthResponse;
import com.portfolio.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public record LoginResult(AuthResponse response, ResponseCookie cookie) {}

    public LoginResult login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("ADMIN");

        ResponseCookie cookie = ResponseCookie.from("portfolio_token", token)
                .httpOnly(true)
                .secure(false) // Set true in production
                .sameSite("Lax")
                .path("/")
                .maxAge(tokenProvider.getExpirationMs() / 1000)
                .build();

        AuthResponse response = AuthResponse.builder()
                .message("Login successful")
                .username(userDetails.getUsername())
                .role(role)
                .build();

        return new LoginResult(response, cookie);
    }

    public ResponseCookie getLogoutCookie() {
        return ResponseCookie.from("portfolio_token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
    }
}
