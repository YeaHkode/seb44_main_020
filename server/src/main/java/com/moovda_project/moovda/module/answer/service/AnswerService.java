package com.moovda_project.moovda.module.answer.service;

import com.moovda_project.moovda.module.answer.entity.Answer;
import com.moovda_project.moovda.module.answer.repository.AnswerRepository;
import com.moovda_project.moovda.global.exception.BusinessLogicException;
import com.moovda_project.moovda.global.exception.ExceptionCode;
import com.moovda_project.moovda.module.question.entity.Question;
import com.moovda_project.moovda.module.question.service.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionService questionService;

    public Answer createAnswer(Answer answer) {
        Question findQuestion = questionService.findVerifiedQuestion(answer.getQuestion().getQuestionId());
        answer.addQuestion(findQuestion);
        // TODO : 영화를 넣는 메서드 새로 추가
        // answer.addMember(answer.getMember()); TODO : MemberIdExtractor에서 memberId 받아서 하는 것으로 수정
        // answer.addMovie(answer.getMovie());
        return answerRepository.save(answer);
    }

    public Answer updateAnswer(Answer answer, long authenticationMemberId) {
        // TODO : 본인 검증 로직 추가
        Answer foundAnswer = findAnswer(answer.getAnswerId());

        checkValidatedMember(authenticationMemberId, foundAnswer);

        foundAnswer.setContent(answer.getContent());
        foundAnswer.setMovie(answer.getMovie());
        foundAnswer.setModifiedAt(answer.getModifiedAt());

        return answerRepository.save(foundAnswer);
    }


    public void deleteAnswer(long answerId, long authenticationMemberId) {
        // TODO : 본인 검증 로직 추가
        Answer findAnswerId = findVerifiedAnswer(answerId);

        checkValidatedMember(authenticationMemberId,findAnswerId);

        answerRepository.delete(findAnswerId);
    }
    public Answer findAnswer(long answerId){
        Optional<Answer> optionalAnswer = answerRepository.findById(answerId);
        return optionalAnswer.orElseThrow( () -> new BusinessLogicException(ExceptionCode.ANSWER_NOT_FOUND));
    }

    /** 질문이 등록된 질문인지 확인 메서드 **/
    public Answer findVerifiedAnswer(long answerId){

        Optional<Answer> findAnswer = answerRepository.findById(answerId);

        Answer answer = findAnswer.orElseThrow(() ->
                new BusinessLogicException(ExceptionCode.QUESTION_NOT_FOUND));

        return answer;
    }

    /** 작성한 회원인지 확인하는 메서드 **/
    private void checkValidatedMember(long memberId, Answer answer) {
        if(answer.getMember().getMemberId()!= memberId) {
            throw new BusinessLogicException(ExceptionCode.MEMBER_UNAUTHORIZED);
        }
    }

 //   public List<Answer> findAnswers(long questionId) {
//        return answerRepository.findAll(questionId);
 //   }
    // TODO : 페이징 기능 추가
}
