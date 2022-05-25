package ru.kata.spring.boot_security.demo.Exceptions;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UserLoginAlreadyExist extends UsernameNotFoundException {

    public UserLoginAlreadyExist(String msg) {
        super(msg);
    }
}
