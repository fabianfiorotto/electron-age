var fs = require("fs").promises;

module.exports = class DrsFile {

  async ls(filename, extension) {
    var ids = [];

    var fd = await fs.open(filename, "r");
    var buffer = Buffer.alloc(40);
    await fd.read(buffer, 0, buffer.length, null);
    var copyright = buffer.toString("utf8");

    buffer = Buffer.alloc(4);
    await fd.read(buffer, 0, buffer.length, null);
    var version = buffer.toString("utf8");

    buffer = Buffer.alloc(12);
    await fd.read(buffer, 0, buffer.length, null);
    var ftype = buffer.toString("utf8");

    buffer = Buffer.alloc(8);
    await fd.read(buffer, 0, buffer.length, null);
    var tableCount = buffer.readInt32LE();
    var drsFileOffset = buffer.readInt32LE(4);

    var table, i;
    var tables = [];

    for (i = 0; i < tableCount; i++) {
      table = {};
      buffer = Buffer.alloc(4);
      await fd.read(buffer, 0, buffer.length, null);
      table.fileExtension = buffer.toString("utf8").trim();

      buffer = Buffer.alloc(8);
      await fd.read(buffer, 0, buffer.length, null);
      table.fileInfoOffset = buffer.readInt32LE();
      table.numFiles = buffer.readInt32LE(4);
      tables.push(table);
    }
    for (i = 0; i < tableCount; i++) {
      table = tables[i];
      table.ids = [];
      for (var j = 0; j < table.numFiles; j++) {
        buffer = Buffer.alloc(12);
        await fd.read(buffer, 0, buffer.length, null);
        var fileId = buffer.readInt32LE();
        table.ids.push(fileId);
      }
      if (!extension) {
        ids = ids.concat(table.ids);
      }else if (extension == table.fileExtension) {
        return table.ids;
      }
    }
    return ids;
  }


  async open(filename, id, extension) {
    var fd = await fs.open(filename, "r");
    var buffer = Buffer.alloc(40);
    await fd.read(buffer, 0, buffer.length, null);
    var copyright = buffer.toString("utf8");

    buffer = Buffer.alloc(4);
    await fd.read(buffer, 0, buffer.length, null);
    var version = buffer.toString("utf8");

    buffer = Buffer.alloc(12);
    await fd.read(buffer, 0, buffer.length, null);
    var ftype = buffer.toString("utf8");

    buffer = Buffer.alloc(8);
    await fd.read(buffer, 0, buffer.length, null);
    var tableCount = buffer.readInt32LE();
    var drsFileOffset = buffer.readInt32LE(4);

    var table, i;
    var tables = [];

    for (i = 0; i < tableCount; i++) {
      table = {};
      buffer = Buffer.alloc(4);
      await fd.read(buffer, 0, buffer.length, null);
      table.fileExtension = buffer.toString("utf8").trim();

      buffer = Buffer.alloc(8);
      await fd.read(buffer, 0, buffer.length, null);
      table.fileInfoOffset = buffer.readInt32LE();
      table.numFiles = buffer.readInt32LE(4);
      tables.push(table);
    }
    for (i = 0; i < tableCount; i++) {
      table = tables[i];
      for (var j = 0; j < table.numFiles; j++) {
        buffer = Buffer.alloc(12);
        await fd.read(buffer, 0, buffer.length, null);
        var fileId = buffer.readInt32LE();
        // if (fileId == id && extension == table.fileExtension) {
        if (fileId == id ) {
          this.fileOffset = buffer.readInt32LE(4);
          this.fileSize = buffer.readInt32LE(8);
          this.fd = fd;
          return this;
        }
      }
    }
    return null;
  }

  async read(buffer, offset, length, position) {
    if (typeof(position) !== "undefined" && position !== null) {
      return await this.fd.read(buffer, offset, length, position + this.fileOffset);
    }
    else {
      return await this.fd.read(buffer, offset, length);
    }
  }

  close(){
    this.fd.close();
  }

  async stat() {
    return {size: this.fileSize};
  }


};
