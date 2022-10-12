import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { ChromePicker } from "react-color";

function getLuminance(rgbColor) {
  const [r, g, b] = Object.keys(rgbColor).map(key => {
    // Our color numbers represent a 8bit channel.
    // The formula requires a sRGB channel which is defined by
    // ColorChannelIn8bit / 255
    const channel = rgbColor[key] / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return parseFloat((0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(3));
}

function getContrastRatio(color) {
  const L = getLuminance(color);
  const cr1 = (L + 0.05) / (0.0 + 0.05);
  const cr2 = (1.0 + 0.05) / (L + 0.05);

  if (cr1 > cr2) {
    return cr1.toFixed(3);
  } else {
    return cr2.toFixed(3);
  }
}

function determineTextColor(color) {
  if (getLuminance(color) > Math.sqrt(1.05 * 0.05) - 0.05) {
    return "#000";
  } else {
    return "#fff";
  }
}

function rgbToString(rgbColor) {
  return `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
}

export default function App() {
  const [bgColor, setBgColor] = React.useState({ r: 0, g: 0, b: 0 });

  const handleColorChange = color => {
    setBgColor(color.rgb);
  };

  return (
    <>
      <GlobalStyles />
      <Styles.Wrapper className="App">
        <Card.Wrapper bgColor={bgColor}>
          <Card.Text bgColor={bgColor}>
            I change color dynamically to guarantee an accessible contrast ratio
          </Card.Text>
        </Card.Wrapper>
        <Contrast.Wrapper>
          <h1>Contrast Ratio</h1>
          <p>{getContrastRatio(bgColor)}:1</p>
        </Contrast.Wrapper>
        <ChromePicker
          disableAlpha
          color={bgColor}
          onChange={handleColorChange}
        />
      </Styles.Wrapper>
    </>
  );
}

const GlobalStyles = createGlobalStyle`
   * {
      margin: 0;
      padding: 0;
      box-sizing: inherit;
      font-size: inherit;
    }

    html {
      box-sizing: border-box;
      font-size: 62.5%; /*1 rem = 10px */
    }

    body {
      font-size: 1.4rem;
      font-family: sans-serif;
    }
`;

const Styles = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    min-height: 100vh;

    background: #f2f2f2;

    & > *:not(:last-child) {
      margin-bottom: 3rem;
    }
  `
};

const Card = {
  Wrapper: styled.div`
    display: flex;

    padding: 2rem 3rem;

    max-width: 30rem;
    width: 100%;

    border-radius: 5px;

    background-color: ${props => rgbToString(props.bgColor)};
  `,
  Text: styled.h1`
    color: ${props => determineTextColor(props.bgColor)};

    text-align: center;
  `
};

const Contrast = {
  Wrapper: styled.div`
    text-align: center;

    & > *:not(:last-child) {
      margin-bottom: 1rem;
    }
  `
};
