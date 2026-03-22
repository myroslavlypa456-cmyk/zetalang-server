function runZeta(code) {
  let vars = {};
  let lines = code.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // let
    if (line.startsWith("let ")) {
      let [_, name, __, value] = line.split(" ");
      vars[name] = isNaN(value) ? value : Number(value);
    }

    // say
    else if (line.startsWith("say ")) {
      let text = line.slice(4);
      text = text.replace(/\{(.*?)\}/g, (_, v) => vars[v] ?? "");
      output(text);
    }

    // random
    else if (line.startsWith("random ")) {
      let [_, name, min, max] = line.split(" ");
      vars[name] = Math.floor(Math.random() * (max - min + 1)) + Number(min);
    }

    // if
    else if (line.startsWith("if ")) {
      let [_, a, op, b] = line.split(" ");
      let cond = false;

      if (op === ">") cond = vars[a] > Number(b);
      if (op === "<") cond = vars[a] < Number(b);
      if (op === "==") cond = vars[a] == b;

      if (!cond) {
        while (lines[i] && lines[i].trim() !== "end") i++;
      }
    }
  }
}

function output(text) {
  const out = document.getElementById("output");
  if (out) out.innerHTML += text + "<br>";
}