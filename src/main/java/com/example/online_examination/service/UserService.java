
package com.example.online_examination.service;

import com.example.online_examination.entity.User;

public interface UserService {

    User registerUser(User user);

    User loginUser(String email, String password);
}
