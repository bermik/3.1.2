package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.UserDTO;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;


@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found.");
        }

        return user;
    }

    @Transactional(readOnly = true)
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public boolean add(User user) {
        User userDB = userRepository.findByEmail(user.getEmail());

        if (userDB != null) {
            return false;
        }

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }

    @Transactional
    public boolean add(UserDTO userDTO) {
        User userDB = userRepository.findByEmail(userDTO.getEmail());
        if (userDB != null) {
            return false;
        }

        User user = new User();

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
        user.setEmail(userDTO.getEmail());
        user.setAge(userDTO.getAge());
        user.addRole(new Role(1L, "ROLE_USER"));
        if (userDTO.getRole().equals("ROLE_ADMIN")) {
            user.addRole(new Role(2L, "ROLE_ADMIN"));
        }

        userRepository.save(user);

        return true;
    }

    @Transactional
    public boolean edit(UserDTO userDTO) {
        if (userRepository.findById(userDTO.getId()).isEmpty())
        {
            return false;
        }

        User userDB = userRepository.findById(userDTO.getId()).get();

        userDB.setFirstName(userDTO.getFirstName());
        userDB.setLastName(userDTO.getLastName());
        if (userDTO.getPassword().isEmpty()) {
            userDB.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
        }
        userDB.setEmail(userDTO.getEmail());
        userDB.setAge(userDTO.getAge());
        userDB.setRoles(new HashSet<>());
        userDB.addRole(new Role(1L, "ROLE_USER"));
        if (userDTO.getRole().equals("ROLE_ADMIN")) {
            userDB.addRole(new Role(2L, "ROLE_ADMIN"));
        }

        userRepository.save(userDB);

        return true;
    }

    @Transactional
    public boolean delete(Long id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    @Transactional(readOnly = true)
    public User findUserById(Long id) {
        Optional<User> userFromDb = userRepository.findById(id);
        return userFromDb.orElse(null);
    }
}
