import styled from "styled-components";

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20vw;
  height: 20vh;
  font-size: 30px;
  margin: 30vh auto;
`;

export default function Loader() {
  return (
    <LoaderWrapper>
      <span>Loading...</span>
    </LoaderWrapper>
  );
}
