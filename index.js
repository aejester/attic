const fs = require("fs");

const read = (database) => {
    
    return JSON.parse(fs.readFileSync(`./database/${database}.json`, "utf8"));
}

const write = (database, data) => {
    
    fs.writeFileSync(`./database/${database}.json`, JSON.stringify(data));
    
}

const add = (database, data, opts = {debug: false}) => {
    if (opts.debug) console.log("reading from database '"+database+"'");
    let db = read(database);
    
    if (typeof data == "object") {
        db.entries.push(data)
    } else {
        throw new Error("Data is not an object. Cannot store it in a row.")
    }

    if (opts.debug) console.log("writing to database '"+database+"'");
    write(database, db);
    if (opts.debug) console.log("wrote to database '"+database+"'");
}

const remove = (database, index, opts = {debug: false}) => {
    if (opts.debug) console.log("reading from the database '"+database+"'")
    let db = read(database);

    if (typeof index == "number") {
        db.entries.splice(index, 1);
        if (opts.debug) console.log("removed row '"+index+"'");
    } else {
        throw new Error("Must give an integer to remove a row.")
    }

    if (opts.debug) console.log("writing to database '"+database+"'");
    write(database, db);
    if (opts.debug) console.log("wrote to database '"+database+"'");
}

const select = (database, conditions, opts = {debug: false}) => {
    if (opts.debug) console.log("reading from the database '"+database+"'")
    let db = read(database);
    let rows = [];

    if (typeof conditions == "object") {

        
        db.entries.forEach((entry, i) => {
            let passed = [];
            let final = true;

            conditions.forEach((condition) => {
                if (opts.debug) console.log("checking row '"+i+"' against condition '"+condition+"'")
                let feild = condition.split(" ")[0];
                let cond = condition;

                if (isNaN(parseInt(entry[feild]))) {
                    if (entry[feild] === true || entry[feild] === false) {
                        cond = cond.replace(feild, entry[feild])
                    } else {
                        cond = cond.replace(feild, "'"+entry[feild]+"'")
                        
                    }
                } else {
                    cond = cond.replace(feild, entry[feild])
                }

                if (opts.debug) console.log(cond);
                passed.push(eval(cond))
            });

            passed.forEach((result) => {
                
                if (result == false) {
                    if (opts.debug) console.log("failed")
                    final = false;
                } else {
                    if (opts.debug) console.log("passed!")
                }

            });

            if (final == true) rows.push(entry);
        });

    } else {
        throw new Error("Cannot operate on condition type '"+(typeof conditions)+"'")
    }

    return rows;
}

exports.read = read;
exports.add = add;
exports.remove = remove;
exports.select = select;