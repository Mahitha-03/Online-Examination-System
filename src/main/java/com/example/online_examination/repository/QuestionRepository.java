
package com.example.online_examination.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.online_examination.entity.Question;

public interface QuestionRepository
        extends JpaRepository<Question, Long> {

    List<Question> findByExamId(Long examId);
}
