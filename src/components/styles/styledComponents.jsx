import { keyframes, Skeleton, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

export const VisuallyHiddenInput = styled("input")({
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    // // position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  });

  export const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  };
  border-radius:1.5rem;
`;

export const InputField = styled("input")`
width:100%;
height:90%;
text-decoration:none;
border-radius:1.5rem;
padding:1rem 2rem;
`;

export const SearchField = styled("input")`
width:10rem;
height:80%;
text-decoration:none;
border-radius:2rem;
padding:1rem 2rem;
`

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;

export const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));


