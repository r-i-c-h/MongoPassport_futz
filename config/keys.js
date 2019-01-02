const getMongo = pwd => {
  return 'mongodb+srv://rich:' + pwd + '@passport-test-lovcq.mongodb.net/test?retryWrites=true';
};
//# mongodb+srv://rich:<PASSWORD>@passport-test-lovcq.mongodb.net/test?retryWrites=true

module.exports = getMongo;
