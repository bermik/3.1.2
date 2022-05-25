package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.Exceptions.DataInfoHandler;
import ru.kata.spring.boot_security.demo.Exceptions.NoSuchUserException;
import ru.kata.spring.boot_security.demo.Exceptions.UserIncorrectData;
import ru.kata.spring.boot_security.demo.Exceptions.UserLoginAlreadyExist;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.UserDTO;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class RestUserController {

    private final UserService userService;

    @Autowired
    public RestUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> apiAllUsers() {
        return new ResponseEntity<>(userService.allUsers(), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> apiFindUser(@PathVariable("id") long id) {
        User user = userService.findUserById(id);

        if (user == null) {
            throw new NoSuchUserException("No user found with ID= " + id);
        }
        return new ResponseEntity<>(userService.findUserById(id), HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<DataInfoHandler> apiAddUser(@Valid @RequestBody UserDTO user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String error = bindingResult
                    .getFieldErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining("; "));
            return new ResponseEntity<>(new DataInfoHandler(error), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.add(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new UserLoginAlreadyExist("Email is already in use");
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<DataInfoHandler> apiEditUser(@PathVariable("id") long id, @Valid @RequestBody UserDTO user, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String error = bindingResult
                    .getFieldErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining("; "));
            return new ResponseEntity<>(new DataInfoHandler(error), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.edit(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new NoSuchUserException("Incorrect data");
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<User> apiDeleteUser(@PathVariable("id") long id) {
        User user = userService.findUserById(id);
        if (user == null) {
            throw new NoSuchUserException("No user found with ID= " + id);
        }

        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/username")
    public ResponseEntity<User> currentUserName(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


}
