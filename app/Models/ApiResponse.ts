//export default class ApiResponse {
//constructor(public message: string, public success: boolean, public data: object | object[]) {}
//}

export default interface ApiResponse {
  message: string
  success: boolean
  data: object | object[]
}
