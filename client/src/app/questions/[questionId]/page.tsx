'use client';

import * as S from '@/app/questions/[questionId]/page.styled';
import AnswerBox from '@/components/Question/AnswerBox';
import { SearchMovieList } from '@/components/Question/Modal';
import SearchBox from '@/components/Question/SearchBox';
import { AnswerType, setAnswerList } from '@/redux/features/answerListSlice';
import { setQuestionId } from '@/redux/features/questionIdSlice';
import { RootState } from '@/redux/store';
import axios from 'axios';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionListResponse } from '../page';

export interface QuestionDetailResponse {
  memberId: number;
  questionId: string;
  nickname: string;
  title: string;
  content: string;
  createdAt: string;
  answerCount: number;
  views: number;
  answers: AnswerType[];
  pageInfo: QuestionListResponse['pageInfo'];
}

const QuestionDetailPage = () => {
  const dispatch = useDispatch();
  const { answers } = useSelector((state: RootState) => state.answerList);
  const userId = useSelector((state: RootState) => state.auth.memberId);
  const { questionId } = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? 1;
  const [pageInfo, setPageInfo] = useState<QuestionListResponse['pageInfo']>({
    page: 1,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  });

  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [questionAndAnswer, setQuestionAndAnswer] =
    useState<QuestionDetailResponse | null>(null);

  useEffect(() => {
    const getQuestionDetailData = async () => {
      const source = `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}?page=${page}`;
      const response = await axios.get(source, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('Authorization'),
        },
      });
      setQuestionAndAnswer(response.data);
      console.log(response.data.answers);
      setPageInfo(response.data.pageInfo);
      dispatch(setAnswerList(response.data.answers));
    };

    getQuestionDetailData();
  }, [questionId, page]);

  const onSubmit = async ({
    selectedMovie,
    textValue,
  }: {
    selectedMovie: SearchMovieList;
    textValue: string;
  }) => {
    const source = `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}/answers`;
    const body = {
      memberId: userId,
      content: textValue,
      title: selectedMovie.title,
      poster: selectedMovie.poster,
      prodYear: selectedMovie.prodYear,
    };

    await axios.post(source, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Authorization'),
      },
    });

    const answerSource = `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}?page=${page}`;
    const response = await axios.get(answerSource, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Authorization'),
      },
    });
    setQuestionAndAnswer(response.data);
    setPageInfo(response.data.pageInfo);
    dispatch(setAnswerList(response.data.answers));
  };

  useEffect(() => {
    if (!questionAndAnswer) return;

    if (questionAndAnswer.memberId === userId) {
      setIsAuthor(true);
    }
  }, [questionAndAnswer]);

  return (
    <S.PageGroup>
      <S.goMenuBtnBox>
        <Link href={'/questions'}>
          <S.goMenuBtn>전체 목록으로 돌아가기</S.goMenuBtn>
        </Link>
      </S.goMenuBtnBox>
      <AskBox isAuthor={isAuthor} question={questionAndAnswer} />
      <SearchBox onSubmit={onSubmit} />
      <AnswerCountBox question={questionAndAnswer} />
      {answers.map((answer) => (
        <AnswerBox
          key={answer.answerId}
          answer={answer}
          question={questionAndAnswer}
        />
      ))}
      <Pagination
        totalElements={pageInfo?.totalElements}
        size={pageInfo?.size}
      />
    </S.PageGroup>
  );
};

interface AnswerCountBoxProps {
  question: QuestionDetailResponse | null;
}

const AnswerCountBox = ({ question }: AnswerCountBoxProps) => {
  return (
    <S.AnswerCountContainer>
      <S.AnswerCountBox>
        댓글&nbsp;&nbsp;<span>{question?.answerCount}</span>
      </S.AnswerCountBox>
    </S.AnswerCountContainer>
  );
};

interface AskBoxProps {
  isAuthor: boolean;
  question: QuestionDetailResponse | null;
}

const AskBox = ({ isAuthor, question }: AskBoxProps) => {
  return (
    <S.AskBox>
      <BoxTop isAuthor={isAuthor} question={question} />
      <S.BoxTitle>{question?.title}</S.BoxTitle>
      <S.BoxMid>
        <S.ContentBox>
          <div>{question?.content}</div>
        </S.ContentBox>
      </S.BoxMid>
    </S.AskBox>
  );
};

interface BoxTopProps {
  isAuthor: boolean;
  question: QuestionDetailResponse | null;
}

const BoxTop = ({ isAuthor, question }: BoxTopProps) => {
  const router = useRouter();
  const { questionId } = useParams();
  const userId = useSelector((state: RootState) => state.auth.memberId);

  const onDelete = async () => {
    if (window.confirm('삭제하시겠습니까?')) {
      const source = `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`;
      await axios.delete(source, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('Authorization'),
        },
      });
    }
    console.log('질문이 삭제되었습니다.');
    router.push('/questions');
  };

  return (
    <S.BoxTop>
      <S.LeftBox>
        <S.Nickname
        // onClick={() => router.push(`/mypage/${question?.questionId}`)}
        >
          {question?.nickname}
        </S.Nickname>
        <S.Time>
          {question?.createdAt
            ? AnswerDate(new Date(`${question.createdAt}z`))
            : ''}
        </S.Time>
      </S.LeftBox>
      <S.RightBox>
        {isAuthor && (
          <Link href={`/questions/edit/${questionId}`}>
            <S.EditBtn>수정</S.EditBtn>
          </Link>
        )}
        {isAuthor && <S.DeleteBtn onClick={onDelete}>삭제</S.DeleteBtn>}
      </S.RightBox>
    </S.BoxTop>
  );
};

interface PaginationProps {
  totalElements: number;
  size: number;
}

const Pagination = ({ totalElements, size }: PaginationProps) => {
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const pathname = usePathname();
  const page = searchParams.get('page') ?? 1;

  const onPaginate = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', value.toString());

      return params.toString();
    },
    [searchParams],
  );

  const pageNumbers = Array.from(
    { length: Math.ceil(totalElements / size) },
    (_, i) => i + 1,
  );

  return (
    <S.PaginationBtnContainer>
      {pageNumbers.map((pageNumber) => (
        <S.PaginationBtnBox key={pageNumber}>
          <S.PaginationBtn
            onClick={() => {
              router.push(pathname + '?' + onPaginate(pageNumber));
            }}
            className={page === pageNumber.toString() ? 'active' : ''}
          >
            {pageNumber}
          </S.PaginationBtn>
        </S.PaginationBtnBox>
      ))}
    </S.PaginationBtnContainer>
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

export default QuestionDetailPage;
