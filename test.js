const engine = require("./index");

engine.add("database", {test: "boom", lmao: "test", int: 10, bool: false});
let rows = engine.select("database", ["test == 'boom'", "lmao == 'test'", "int == 10", "bool == false"], {debug: true})
console.log(rows);
engine.remove("database", 0)
