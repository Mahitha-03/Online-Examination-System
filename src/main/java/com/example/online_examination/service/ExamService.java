package com.example.online_examination.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.online_examination.entity.Exam;
import com.example.online_examination.repository.ExamRepository;

@Service
public class ExamService implements ExamServiceInterface {

    private final ExamRepository examRepository;

    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    // Create an exam
    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    // Get all examswhy shuld we write methods @getters @ste=
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    // Get an exam by ID
    public Exam getExamById(Long id) {
        return examRepository.findById(id).orElse(null);
    }

    // Update an exam
    public Exam updateExam(Long id, Exam updatedExam) {
        return examRepository.findById(id).map(exam -> {
            exam.setTitle(updatedExam.getTitle());
            exam.setDescription(updatedExam.getDescription());
            exam.setDurationMinutes(updatedExam.getDurationMinutes());
            exam.setTotalMarks(updatedExam.getTotalMarks());

            return examRepository.save(exam);
        }).orElse(null);
    }

    // Delete an exam
    public boolean deleteExam(Long id) {
        if (examRepository.existsById(id)) {
            examRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
