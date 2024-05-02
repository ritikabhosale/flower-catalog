class UserStore {
  constructor(pool) {
    this.pool = pool;
  }

  async getUsers() {
    const query = "SELECT * from users";
    var result;
    try {
      result = await this.pool.query(query);
    } catch (error) {
      console.log(error);
    }
    return result.rows;
  }

  async doesUserExist(details) {
    const users = await this.getUsers();

    return users.some((user) => user.email == details.email);
  }

  async saveUser(details) {
    const query = `insert into users ("name", "email", "password", "phone_number") values ('${details.name}', '${details.email}', '${details.password}', '${details.mobNo}');`;

    try {
      await this.pool.query(query);
    } catch (error) {
      console.log(error);
    }
  }

  async authenticate(details) {
    const query = `select * from users where email = '${details.email}'`;
    var result;

    try {
      result = await this.pool.query(query);
    } catch (error) {
      console.log(error);
    }

    if (result.rows.length == 0) {
      return false;
    }

    if (result.rows[0].password != details.password) {
      return false;
    }

    return true;
  }

  async getUser(details) {
    const query = `select * from users where email = '${details.email}'`;
    var result;

    try {
      result = await this.pool.query(query);
    } catch (error) {
      console.log(error);
    }

    return result.rows[0];
  }
}

module.exports = { UserStore };
