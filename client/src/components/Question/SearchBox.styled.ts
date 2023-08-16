'use client';

import styled from 'styled-components';

export const SearchBoxGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SearchBox = styled.div`
  margin: 1.5rem 1rem;
  width: 1024px;
  background-color: #334163;
  border-radius: 16px;
  padding: 1rem;
`;

export const SelectedMovieContainer = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  width: 32%;
  border-radius: 4px;
  border-left: 10px solid #111321;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`;

export const Poster = styled.div`
  display: flex;
  height: 64px;
`;

export const MovieInfo = styled.div`
  font-size: 0.75rem;
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SelectedMovieTitle = styled.p`
  padding-top: 0.5rem;
  padding-left: 0.75rem;
  font-weight: 700;
  font-size: small;
  color: black;
  text-decoration: none;
`;

export const SelectedMovieProdYear = styled.p`
  padding-left: 0.75rem;
  color: #5d5d5d;
`;

export const ChangeMovieButton = styled.button`
  border-radius: 4px;
  width: 100%;
  background-color: #e1e1e1;
  color: black;
  &:hover {
    background-color: #111321;
    cursor: pointer;
    color: white;
  }
  display: flex;
  height: 48px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: medium;
  margin: 0.25rem 0 0.5rem 0;
`;

export const MovieSelector = styled.div``;

export const MoviePickButton = styled.button`
  width: 100%;
  height: 50px;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: medium;
  cursor: pointer;
`;

export const AnswerCreateBox = styled.div`
  height: 152px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 142px;
  resize: none;
  padding: 1rem;
`;

export const ButtonBox = styled.div`
  display: flex;
  justify-content: end;
`;

export const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #e1e1e1;
  color: black;
  &:hover {
    background-color: #111321;
    cursor: pointer;
    color: white;
  }
  cursor: pointer;
  font-weight: 700;
`;
