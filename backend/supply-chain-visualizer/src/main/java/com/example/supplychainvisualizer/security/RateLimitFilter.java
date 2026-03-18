package com.example.supplychainvisualizer.security;

import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, RateLimitEntry> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, RateLimitEntry> registerAttempts = new ConcurrentHashMap<>();

    private static final int LOGIN_MAX_REQUESTS = 10;
    private static final int REGISTER_MAX_REQUESTS = 5;
    private static final long WINDOW_MS = 60_000; // 1 minute

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIp(request);

        if (path.startsWith("/api/auth/login")) {
            if (isRateLimited(clientIp, loginAttempts, LOGIN_MAX_REQUESTS)) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"Too many requests. Please try again later.\"}");
                return;
            }
        } else if (path.startsWith("/api/auth/register")) {
            if (isRateLimited(clientIp, registerAttempts, REGISTER_MAX_REQUESTS)) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"Too many requests. Please try again later.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(String clientIp, Map<String, RateLimitEntry> attempts, int maxRequests) {
        long now = System.currentTimeMillis();
        attempts.compute(clientIp, (key, entry) -> {
            if (entry == null || now - entry.windowStart > WINDOW_MS) {
                return new RateLimitEntry(now, new AtomicInteger(1));
            }
            entry.count.incrementAndGet();
            return entry;
        });

        RateLimitEntry entry = attempts.get(clientIp);
        return entry != null && entry.count.get() > maxRequests;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RateLimitEntry {
        final long windowStart;
        final AtomicInteger count;

        RateLimitEntry(long windowStart, AtomicInteger count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
