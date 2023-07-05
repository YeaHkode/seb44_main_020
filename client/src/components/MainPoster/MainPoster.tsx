import React from 'react';
import * as S from './MainPoster.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from 'react-router-dom';
import { StarrateShow } from '../Starrate/StarrateShow';
// import { handleDelete } from '../../axiosFunction';

interface Props{
    data:{
    img:string;
    title:string;
    star:number;
}
isWatched:boolean;
isToWatch:boolean;
}

export function MainPoster({data,isWatched,isToWatch}:Props) {
// const navigate=useNavigate();

// const movieId=data.movie-id

// const goToMovieDetail = () => {
//     const movieId = data.movie-id;
//     navigate(`/movies/${movieId}`);
//   };
 
// const handleDelete=()=>{
//             {handleDelete(`/movies/toWatch/${toWatch-id}`)}
// };

    return (<S.Container> {/*onClick시 goToMovieDetail */}
            <S.PosterImg src={data.img} alt="영화포스터" />
            <S.Title><S.TitleText>{data.title}</S.TitleText></S.Title>
            {isWatched===false?(<S.Star><StarrateShow rate={data.star?data.star:0}/></S.Star>):''} {/*본영화 리스트 목록일때 별점 노출 */}
            {isToWatch?(<S.Delete><FontAwesomeIcon icon={faTrash} color='#7EAEF6'/></S.Delete>):''} {/*볼영화일때 삭제 버튼 노출 onClick시 handleDelete*/}
    </S.Container>);
}