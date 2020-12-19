class StoreUser {
  get rules() {
    return {
      email: 'required',
      password: 'required',
      firstName: 'required',
      lastName: 'required',
      phone: 'required',
      gender: 'required',
      birthday: 'required',
      state: 'required',
      city: 'required',
      isTeacher: 'required|boolean',
      status: 'boolean',
    };
  }
}

module.exports = StoreUser;
