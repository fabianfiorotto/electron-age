module.exports = class SlpPalette {

  static async load(file) {
    var stat = await file.stat();
    var buffer = Buffer.alloc(stat.size);
    await file.read(buffer, 0, buffer.length, 0);
    var text = buffer.toString();
    var lines = text.split("\r\n");

    var id = lines.shift();
    var version = lines.shift();
    var entries = lines.shift();

    lines.pop();
    file.close();

    return lines.map((l) => l.split(" ").map((n) => parseInt(n)));
  }

};
