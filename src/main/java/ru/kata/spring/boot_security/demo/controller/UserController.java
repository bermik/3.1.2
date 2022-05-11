package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Controller
@ComponentScan(value = "demo")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/admin")
    public String getUsers(Model model) {
        List<User> users = userService.allUsers();
        model.addAttribute("users", users);
        return "admin";
    }

    @GetMapping("/user-create")
    public String createUserForm(User user) {
        return "user-create";
    }

    @PostMapping("/user-create")
    public String createUser(User user) {
        userService.add(user);
        return "redirect:/admin";
    }

    @DeleteMapping("user-delete/{id}")
    public String deleteUser(@PathVariable("id") Long id, HttpServletResponse response) {
        userService.delete(id);
        return "redirect:/admin";
    }

    @GetMapping("user-edit/{id}")
    public String editUserForm(@PathVariable("id") Long id, Model model) {
        User user = userService.findUserById(id);
        model.addAttribute("user", user);
        return "/user-edit";
    }

    @PutMapping("/user-edit")
    public String editUser(User user) {
        userService.add(user);
        return "redirect:/admin";
    }
}
