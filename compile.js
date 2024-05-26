function lexer(input) {
  const tokens = [];
  let cursor = 0;
  while (cursor < input.length) {
    let char = input[cursor];

    //skip whitespace
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (/[a-zA-Z]/.test(char)) {
        word += char;
        cursor++;
        char = input[cursor];
      }

      if (word === "ye" || word === "bol") {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }

      continue;
    }

    if (/[0-9]/.test(char)) {
      let num = "";
      while (/[0-9]/.test(char)) {
        num += char;
        cursor++;
        char = input[cursor];
      }
      tokens.push({ type: "number", value: parseInt(num) });
      continue;
    }

    if (/[\+\-\*\/=]/.test(char)) {
      tokens.push({ type: "operator", value: char });
      cursor++;
      continue;
    }
  }

  return tokens;
}

function parser(tokens) {
  //console.log("parser started");
  const ast = {
    type: "Program",
    body: [],
  };

  while (tokens.length > 0) {
    let token = tokens.shift();
    if (token.type === "keyword" && token.value === "ye") {
      let declaration = {
        type: "Declaration",
        name: tokens.shift().value,
        value: null,
      };
      if (tokens[0].type === "operator" && tokens[0].value === "=") {
        tokens.shift();
        let expression = "";
        while (tokens.length > 0 && tokens[0].type !== "keyword") {
          expression += tokens.shift().value;
        }
        declaration.value = expression.trim();
      }
      ast.body.push(declaration);
    }

    if (token.type === "keyword" && token.value === "bol") {
      ast.body.push({
        type: "Print",
        expression: tokens.shift().value,
      });
    }
  }

  return ast;
}

function codeGen(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGen).join("\n");
    case "Declaration":
      return `const ${node.name} = ${node.value};`;
    case "Print":
      return `console.log(${node.expression});`;
  }
}

function runner(input) {
  eval(input);
}

function compiler(input) {
  // console.log("compiler started");
  const tokens = lexer(input);
  // console.log(tokens);
  const ast = parser(tokens);
  // console.log(ast);
  const executableCode = codeGen(ast);
  // console.log(executableCode);
  return executableCode;
}

const mcode = `
ye x = 10
ye y = 26

ye sum = x + y
bol sum
`;

const execu = compiler(mcode);

runner(execu);
