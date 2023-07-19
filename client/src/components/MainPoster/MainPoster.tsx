import { useCallback } from 'react';
import Link from 'next/link';
import { faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import * as S from './MainPoster.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StarrateShow } from '../Starrate/StarrateShow';
import {useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { handleDelete } from '@/api/axiosHandler';
import { useRouter } from 'next/navigation';

interface Props {
  data: {
    movieId?:number;
    poster: string;
    title: string;
    star?: number;
  };
  isWatched: boolean;
  isToWatch: boolean;
}

//조건부 노출을 위해서 isWatched isToWatch 프롭스도 항상 함께 전달해주어야 합니다.
//예시: <MainPoster key={id값} data={data} isWatched={false} isToWatch={false}/>

export function MainPoster({ data, isWatched, isToWatch }: Props) {
  const router=useRouter();

  const dragState=useSelector((state:RootState)=>state.drag.value);

  const goToMovieDetail=()=>{
  if(dragState===false){
    router.push(`/movies/${movieId}`);
  }
}

  const {movieId}=data
  const showDelete =useSelector((state: RootState)=> state.showDelete.value);

      const handleDeleteMovie=(e: React.MouseEvent<HTMLDivElement>)=>{
        handleDelete(`/movies/toWatch/${movieId}`); {/*서버 URL 추가 필요 */}
        e.preventDefault();
    };

  return (
    <S.Container onClick={goToMovieDetail}>
      <S.PosterImg src={data.poster} alt="영화포스터" />
      <S.Title>
        <S.TitleText>{data.title}</S.TitleText>
      </S.Title>
      {isWatched ? (
        <S.Star>
          <StarrateShow rate={data.star ? data.star : 0} />
        </S.Star>
      ) : (
        ''
      )}{' '}
      {/*본영화 리스트 목록일때 별점 노출 */}

      {isToWatch? (showDelete?(<S.Delete onClick={handleDeleteMovie}>
          <FontAwesomeIcon icon={faSquareMinus} color="rgb(255, 255, 255,0.75)" />
        </S.Delete>):''):
        ''
      }
      {/*볼영화일때 삭제 버튼 노출 onClick시 handleDelete*/}
      
    </S.Container>
  );
}
