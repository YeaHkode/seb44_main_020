'use client';
import * as S from '@/components/Question/AnswerBox.styled';
import { useRouter } from 'next/navigation';

const AnswerBox = () => {
  return (
    <S.AnswerBox>
      <AnswerBoxTop />
      <S.AnswerBoxMid>
        <S.ContentBox>
          <div>내용</div>
        </S.ContentBox>
      </S.AnswerBoxMid>
      <AnswerBoxBottom />
    </S.AnswerBox>
  );
};

const AnswerBoxTop = () => {
  const router = useRouter();

  return (
    <S.BoxTop>
      <S.LeftBox>
        <S.Nickname
          onClick={() =>
            // TODO: 회원 === 글작성자 => 본인 mypage || 회원 != 글작성자 => 글작성자 mypage
            router.push('/mypage')
          }
        >
          닉네임
        </S.Nickname>
        <S.Time>{AnswerDate(new Date())}</S.Time>
      </S.LeftBox>
      <S.RightBox>
        <S.EditBtn>수정</S.EditBtn>
        <S.DeleteBtn>삭제</S.DeleteBtn>
      </S.RightBox>
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

const AnswerBoxBottom = () => {
  const router = useRouter();
  return (
    <S.BoxBottom>
      <S.SelectedMovieBox
        onClick={() =>
          //TODO: movie 클릭시 해당 movie홈페이지로 이동
          router.push('/movie')
        }
      >
        <S.Poster>포스터</S.Poster>
        <S.MovieInfo>
          <S.MovieTitle>제목</S.MovieTitle>
          <S.MovieReleaseDate>개봉년도</S.MovieReleaseDate>
        </S.MovieInfo>
      </S.SelectedMovieBox>
    </S.BoxBottom>
  );
};

export default AnswerBox;
