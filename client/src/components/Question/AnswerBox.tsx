'use client';

import { QuestionDetailResponse } from '@/app/questions/[questionId]/page';
import * as S from '@/components/Question/AnswerBox.styled';
import {
  AnswerType,
  deleteAnswerList,
  editAnswerList,
  setAnswerList,
} from '@/redux/features/answerListSlice';
import { RootState } from '@/redux/store';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchMovieList } from './Modal';
import SearchBox from './SearchBox';
import { QuestionListResponse } from '@/app/questions/page';

interface AnswerBoxProps {
  answer: AnswerType;
  question: QuestionDetailResponse | null;
}

const AnswerBox = ({ answer, question }: AnswerBoxProps) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const dispatch = useDispatch();
  const { questionId } = useParams();
  const answerId = answer.answerId;

  const onEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async ({
    selectedMovie,
    textValue,
  }: {
    selectedMovie?: SearchMovieList;
    textValue: string;
  }) => {
    const source = `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}/answers/${answerId}`;
    const body = {
      memberId: answer.memberId,
      content: textValue,
      title: selectedMovie?.title,
      poster: selectedMovie?.poster,
      prodYear: selectedMovie?.prodYear,
    };
    const response = await axios.patch(source, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Authorization'),
      },
    });
    setIsEditing(false);

    dispatch(
      editAnswerList({
        questionId: answer.questionId,
        content: textValue,
        movie: {
          title: selectedMovie?.title,
          poster: selectedMovie?.poster,
          prodYear: selectedMovie?.prodYear,
        },
      }),
    );
  };

  return (
    <S.AnswerBoxGroup>
      <S.AnswerBox>
        <AnswerBoxTop
          onEditClick={onEditClick}
          answer={answer}
          question={question}
        />
        <S.AnswerBoxMid>
          {isEditing ? (
            <SearchBox
              onSubmit={onSubmit}
              defaultValue={{
                movieId: '',
                content: answer.content,
                title: answer.movie?.title,
                poster: answer.movie?.poster,
                prodYear: answer.movie?.prodYear,
                pageInfo: {
                  currentPage: 0,
                  pageSize: 0,
                  total: 0,
                },
              }}
            />
          ) : (
            <S.ContentBox>
              <div>{answer.content}</div>
              <AnswerBoxBottom answer={answer} />
            </S.ContentBox>
          )}
        </S.AnswerBoxMid>
      </S.AnswerBox>
    </S.AnswerBoxGroup>
  );
};

interface AnswerBoxTopProps {
  onEditClick: () => void;
  answer: AnswerType;
  question: QuestionDetailResponse | null;
}

const AnswerBoxTop = ({ onEditClick, answer, question }: AnswerBoxTopProps) => {
  const dispatch = useDispatch();
  const answerId = answer.answerId;
  const { questionId } = useParams();
  const userId = useSelector((state: RootState) => state.auth.memberId);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? 1;
  const [pageInfo, setPageInfo] = useState<QuestionListResponse['pageInfo']>({
    page: 1,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  });
  // 댓글 삭제
  // const handleDeleteAnswer = async () => {
  //   dispatch(deleteAnswerList(answer));
  //   const source = `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}/answers/${answerId}`;
  //   await axios.delete(source, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: localStorage.getItem('Authorization'),
  //     },
  //   });
  //   alert('답변이 삭제되었습니다.');
  // };

  const onDeleteAnswer = async (answerId: any) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const source = `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}/answers/${answerId}`;
      await axios.delete(source, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('Authorization'),
        },
      });

      // 서버에서 댓글 삭제 후에 서버에서 새로운 댓글 목록을 가져옴
      const updatedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}?page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization'),
          },
        },
      );

      // 업데이트된 댓글 목록과 answerCount를 상태로 업데이트
      dispatch(setAnswerList(updatedResponse.data.answers));
      setPageInfo(updatedResponse.data.pageInfo);
    }
  };

  useEffect(() => {
    if (userId === answer.memberId) {
      setIsAuthor(true);
    }
  }, []);

  return (
    <S.BoxTop>
      <S.LeftBox>
        {/* <Link href={`/mypage/${answer.nickname}}`}> */}
        <S.Nickname>{answer.nickname}</S.Nickname>
        {/* </Link> */}
        <S.Time>
          {question?.createdAt
            ? AnswerDate(new Date(`${question.createdAt}z`))
            : ''}
        </S.Time>
      </S.LeftBox>
      {isAuthor && (
        <S.RightBox>
          <S.EditBtn onClick={onEditClick}>수정</S.EditBtn>
          <S.DeleteBtn onClick={onDeleteAnswer}>삭제</S.DeleteBtn>
        </S.RightBox>
      )}
    </S.BoxTop>
  );
};

const AnswerDate = (createdAt: Date): string => {
  const milliSeconds: number = new Date().getTime() - createdAt.getTime();
  const seconds: number = milliSeconds / 1000;

  if (seconds < 60) return `방금 전`;
  const minutes: number = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}분 전`;
  const hours: number = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}시간 전`;
  const days: number = hours / 24;
  if (days < 7) return `${Math.floor(days)}일 전`;
  const weeks: number = days / 7;
  if (weeks < 5) return `${Math.floor(weeks)}주 전`;
  const months: number = days / 30;
  if (months < 12) return `${Math.floor(months)}개월 전`;
  const years: number = days / 365;
  return `${Math.floor(years)}년 전`;
};

interface AnswerBoxBottomProps {
  answer: AnswerType;
}

const AnswerBoxBottom = ({ answer }: AnswerBoxBottomProps) => {
  const { movieId } = useParams();
  return (
    <Link href={`/movies/${movieId}`}>
      <S.BoxBottom>
        <S.SelectedMovieBox>
          <S.Poster>
            <div>
              <img
                src={answer?.movie?.poster}
                alt="movieposter"
                width={'56px'}
                height={'64px'}
              />
            </div>
          </S.Poster>
          <S.MovieInfo>
            <S.MovieTitle>{answer?.movie?.title}</S.MovieTitle>
            <S.MovieReleaseDate>{answer?.movie?.prodYear}</S.MovieReleaseDate>
          </S.MovieInfo>
        </S.SelectedMovieBox>
      </S.BoxBottom>
    </Link>
  );
};

export default AnswerBox;
