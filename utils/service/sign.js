const prodata = function (data) {
  var _arr = {
      data: '',
    }
  var pubdata = {
    ...data,
  }
  _arr.data = JSON.stringify(pubdata)
  return _arr
}


module.exports = {
  prodata: prodata,
}
