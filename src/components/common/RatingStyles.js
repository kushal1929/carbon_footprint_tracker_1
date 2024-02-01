import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 10vh;
  font-size: 45px;

  @media (max-width: 768px) {
    font-size: 10vw; // Adjust the value accordingly
  }
`;

export const Radio = styled.input`
  display: none;
`;

export const Rating = styled.div`
  cursor: pointer;
`;
