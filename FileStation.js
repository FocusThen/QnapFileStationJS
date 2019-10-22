let { Qnap } = require("./Qnap");

class FileStation extends Qnap {
  async listShare() {
    // List All Shared folders..
    const response = await this.req(
      this.endpoint(null, "get_tree", { is_iso: 0, node: "recycle_root" })
    );
    return response;
  }

  async list(path, limit = 10000) {
    // List file in a folder.
    const response = await this.req(
      this.endpoint(null, "get_list", { is_iso: 0, limit, path })
    );
    return response;
  }

  async search(path, pattern) {
    const response = await this.req(
      this.endpoint(null, "search", {
        limit: 10000,
        start: 0,
        source_path: path,
        keyword: pattern
      })
    );
    return response;
  }
}

module.exports.FileStation = FileStation;
