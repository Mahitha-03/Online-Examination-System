package com.example.online_examination.service;

import java.util.List;
import com.example.online_examination.entity.Exam;
public interface ExamServiceInterface {
  Exam createExam(Exam exam);

    List<Exam> getAllExams();

    Exam getExamById(Long id);

    Exam updateExam(Long id, Exam updatedExam);

    boolean deleteExam(Long id);
}


