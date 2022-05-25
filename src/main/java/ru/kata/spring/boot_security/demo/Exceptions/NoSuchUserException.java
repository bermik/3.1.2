package ru.kata.spring.boot_security.demo.Exceptions;

public class NoSuchUserException extends RuntimeException {

    public NoSuchUserException(String message) {
        super(message);
    }
}
