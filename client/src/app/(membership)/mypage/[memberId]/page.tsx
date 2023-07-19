'use client';
import { click } from '@/redux/features/deleteSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect,useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { MainPoster } from '@/components/MainPoster/MainPoster';
import { data } from './dummydata';
import * as S from './page.styled';
import theme from '@/components/MainPoster/theme';
import { ThemeProvider } from 'styled-components';
import { RootState } from '@/redux/store';
import MyCarousel from '@/components/MyCarousel/MyCarousel';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface ToWatch {
  movieId:number;
  title:string;
  poster:string;
 }

interface Watched{
  movieId:number;
  title:string;
  poster:string
}

interface My{
  memberId:number;
  nickname:string;
  toWatch: ToWatch[]
  watched: Watched[]
}

export default function MyPage() {

const router=useRouter();
// const [data,setData]=useState<My | null>(null);
const {memberId}=useParams();

    const showDelete =useSelector((state: RootState)=> state.showDelete.value);
    const dispatch=useDispatch();

  const handleShowDelete = () => {
    dispatch(click());
  };

  // useEffect(()=>{
  //   axios.get(`/v11/members/${memberId}`)
  //   .then((res)=>{
  //     setData(res.data);
  //   }).catch((error)=>{
  //     console.log(error.message);
  //   });
  // },[]);

  //회원삭제
  // const handleDelete = useCallback(() => {
  //   if (window.confirm('삭제하시겠습니까?')) {
  //     axios
  //       .delete(
  //         `주소/members/${member_id}`,
  //         {
  //           headers: {
  //            'Authorization': ''
  //           },
  //         }
  //       )
  //       .then(() => {
  //       //로그아웃
  //       alert('회원 정보가 삭제되었습니다.');
  //       router.push('/');
  //       })
  //       .catch((error) => {
  //         console.log( error.message);
  //       });
  //   }
  // }, [memberId]);


const toWatchlist =data?.toWatch?.map((list)=>(
<ThemeProvider theme={theme.myPage} key={list.movieId}>
<MainPoster data={list} isWatched={false} isToWatch={true}/> 
</ThemeProvider>
));

const watchedList=data?.watched?.map((list)=>(
    <ThemeProvider theme={theme.myPage} key={list.movieId}>
    <MainPoster key={list.movieId} data={list} isWatched={true} isToWatch={false}/> 
    </ThemeProvider>
  ));
  
  return <S.Wrapper>
  <S.PageTitle>     {/*현재 로그인한 사용자와 my paged의 member_id가 같을 때 표시 */}
    my page
  </S.PageTitle>
  <S.Container>
    <S.Nickname>{data?.nickname} 님의 리스트</S.Nickname>
    <S.SectionWrapper>
    <S.Section>
    <S.SectionTitle>
      <S.Title>볼 영화</S.Title>   
      <S.ShowDelete onClick={handleShowDelete}>편집</S.ShowDelete></S.SectionTitle>  {/*현재 로그인한 사용자와 my paged의 member_id가 같을 때 표시 */}
    <S.SectionContent>
    <S.MovieList><MyCarousel props={toWatchlist} /></S.MovieList>
    </S.SectionContent>
    </S.Section>
    <S.Section>
    <S.SectionTitle><S.Title>본 영화</S.Title> </S.SectionTitle>
    <S.SectionContent>
    <S.MovieList><MyCarousel props={watchedList} /></S.MovieList>
    </S.SectionContent>
    </S.Section>
    <S.Section> {/*현재 로그인한 사용자와 my paged의 member_id가 같을 때 표시 */}
    <S.SectionTitle><S.Title>계정 관리</S.Title></S.SectionTitle>
    <S.DeleteContainter>
      <S.Text>회원 삭제</S.Text>
      <S.DeleteBtn>삭제하기</S.DeleteBtn>  {/*onClick시 handleDelete*/}
      </S.DeleteContainter>
    </S.Section>
    </S.SectionWrapper>
  </S.Container>
</S.Wrapper>;
}
