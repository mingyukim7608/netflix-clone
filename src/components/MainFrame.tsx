import styled from "styled-components";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Wrapper = styled.div`
  width: 100vw;

  background-color: black;
  box-sizing: border-box;
`;

const OutletWrapper = styled.div`
  width: 100vw;
  height: 200vh;
  background-color: black;
  box-sizing: border-box;
`;

export default function MainFrame() {
  return (
    <Wrapper>
      <Header />
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </Wrapper>
  );
}
