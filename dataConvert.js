const path = require('path');
const fileName = path.basename(__filename);
console.log(fileName);
const data = {
  files: {
    name: fileName.replace(/\.js/g, '')
  },
  info: {
    owner: "Ngo Minh Tu",
    api_name: "Api login",
    path: "api/login",
    overview: "đăng nhập",
  },
  fields: [
    {
      name: "user_name",
      description: "Tên đăng nhập",
      type: "String",
      note: "không có ghi chú chi",
      validate: [
        {
          require: true,
          message: "trường này bắt buộc phải nhập",
        },
        {
          min: 4,
          message: "nhập ít nhất 4 ký tự",
        },
      ],
    },
    {
      name: "password",
      description: "mật khẩu đăng nhập",
      type: "String",
      note: "không có ghi chú chi",
      validate: [
        {
          require: true,
          message: "trường này bắt buộc phải nhập",
        },
        {
          max: 4,
          message: "nhập ít nhất 4 ký tự",
        },
      ],
    },
  ],
  request: {
    user_name: 'a@gmail.com',
    password: '123@123'
  },
  response: {
    ok: 'trả về success code : 200',
    notOk: 'Trả về error code: 400 (Refer ■Error code 3)',
    data: {
      token: 'token>>>',
      refetch_token: 'refetch token>>>',
      user: {
        id: 'id_user',
        name: 'name',
        age: 26,
      },
      idNe:'aaaa'
    }
  },
  errors: [
    {
      code: '400',
      content: 'Parameter error',
      messages: [
        'identifier is a required field',
        'password is a required field',
        'Invalid identifier or password'
      ],
      note: 'T có note gì đâu'
    }
  ]
};

module.exports = data;
