let data ='eyJub25jZSI6IjgiLCJjYWxsRGF0YSI6IjNhOTM0MjRhMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImdhc1ByaWNlIjoiMTAwMDAwMDAwMCIsInZhbHVlIjoiMTAwMDAwMDAwMDAwMDAwMDAwMCIsImdhc0xpbWl0IjoiNTAwMDAwIiwidG9BZGRyZXNzIjoiN0JBRk9OUzVJVUEzWEg0QzYyWkhYRVpTWEJaU01KWVgifQ=='

var utils = require('Exoduscore/utils')
let obj = utils.base64ToString(data)

console.log(obj)