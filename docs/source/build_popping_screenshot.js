const fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

const popping1 = base64_encode('./userguide/screenshots/popping-1.png');
const popping2 = base64_encode('./userguide/screenshots/popping-2.png');
const popping3 = base64_encode('./userguide/screenshots/popping-3.png');
const popping4 = base64_encode('./userguide/screenshots/popping-4.png');

var svg_template = fs.readFileSync('./userguide/screenshots/window_popping_template.svg', "utf8");


var re = /"data:image\/png;base64,.*?="/g;

var matches = svg_template.match(re);

console.log(matches.length)

if (matches.length != 4) {
  console.log("ERROR: expecting 4 images to replace, instead found " + matches.length)
  return
}

let svg_output = svg_template.replace(matches[0], `"data:image\/png;base64,${popping1}"`);
svg_output = svg_output.replace(matches[1], `"data:image\/png;base64,${popping2}"`);
svg_output = svg_output.replace(matches[2], `"data:image\/png;base64,${popping3}"`);
svg_output = svg_output.replace(matches[3], `"data:image\/png;base64,${popping4}"`);

fs.writeFileSync('./userguide/screenshots/window_popping_output.svg', svg_output, 'utf8');

