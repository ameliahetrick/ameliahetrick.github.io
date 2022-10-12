import "./styles.css";
import * as AColorPicker from "a-color-picker";

document.getElementById("app").innerHTML = `
<h1>Test picker</h1>
<div id="picker"></div>
`;

AColorPicker.from("#picker");
