package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.UserDTO;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
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
        model.addAttribute("newUser", new UserDTO());
        return "admin";
    }

    @PostMapping("/newUser")
    public String newUser(UserDTO user, Model model) {
        userService.add(user);
        return "redirect:/admin";
    }

    @DeleteMapping("user-delete/{id}")
    public String deleteUser(@PathVariable("id") Long id, HttpServletResponse response) {
        userService.delete(id);
        return "redirect:/admin";
    }

    @PutMapping("user-edit")
    public String editUser(UserDTO user, Model model) {
        userService.edit(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/admin/deleteUser/{id}")
    public String deleteUser(@RequestParam("id") Long id, Model model) {
        userService.delete(id);
        return "redirect:/admin";
    }
}
