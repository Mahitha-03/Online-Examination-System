
package com.example.online_examination.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.online_examination.entity.Exam;
import com.example.online_examination.service.ExamService;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:5173")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    // CREATE
    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        return examService.createExam(exam);
    }

    // READ ALL
    @GetMapping
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        Exam exam = examService.getExamById(id);

        if (exam == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(exam);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(
            @PathVariable Long id,
            @RequestBody Exam updatedExam) {

        Exam exam = examService.updateExam(id, updatedExam);

        if (exam == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(exam);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        boolean deleted = examService.deleteExam(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
