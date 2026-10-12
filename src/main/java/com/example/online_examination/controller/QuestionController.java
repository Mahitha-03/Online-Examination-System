
package com.example.online_examination.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.online_examination.entity.Question;
import com.example.online_examination.service.QuestionService;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<Question> addQuestion(
            @RequestBody Question question) {

        Question savedQuestion =
                questionService.addQuestion(question);

        return ResponseEntity.ok(savedQuestion);
    }

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(
                questionService.getAllQuestions());
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<Question>> getQuestionsByExamId(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                questionService.getQuestionsByExamId(examId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long id) {

        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
