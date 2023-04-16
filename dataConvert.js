const data = {
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
};

module.exports = data;
