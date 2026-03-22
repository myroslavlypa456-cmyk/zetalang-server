module.exports = function(code) {
    let output = "";
    let vars = {};

    const lines = code.split("\n");

    for (let line of lines) {
        line = line.trim();

        if (line.startsWith("set")) {
            let [_, name, val] = line.split(" ");
            vars[name] = Number(val);
        }

        if (line.startsWith("add")) {
            let [_, name, val] = line.split(" ");
            vars[name] += Number(val);
        }

        if (line.startsWith("say")) {
            let text = line.replace("say ", "");
            text = text.replace(/\{(.*?)\}/g, (_, v) => vars[v] || "");
            output += text + "\n";
        }

        if (line.startsWith("if")) {
            let match = line.match(/if (.*?) (>|<|==) (.*?) say "(.*?)"/);
            if (match) {
                let [, a, op, b, text] = match;
                if (eval(`${vars[a]} ${op} ${b}`)) {
                    output += text + "\n";
                }
            }
        }
    }

    return output;
};