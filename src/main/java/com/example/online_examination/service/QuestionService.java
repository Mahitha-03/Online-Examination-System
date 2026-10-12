
package com.example.online_examination.service;

import java.util.List;
import com.example.online_examination.entity.Question;

public interface QuestionService {

    Question addQuestion(Question question);

    List<Question> getQuestionsByExamId(Long examId);

    List<Question> getAllQuestions();

    void deleteQuestion(Long id);
}
