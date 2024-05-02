class GuestBook {
  constructor(pool) {
    this.pool = pool;
  }

  async getComments() {
    const query = "SELECT * from comments";
    var result;
    try {
      result = await this.pool.query(query);
    } catch (error) {
      console.log(error);
    }
    return result.rows;
  }

  async addComment(details) {
    const query = `insert into comments ("user_id", "body") values ('${details.userId}', '${details.comment}');`;

    try {
      await this.pool.query(query);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { GuestBook };
