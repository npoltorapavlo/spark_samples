export default class User {
  constructor(name) {
    this.name = name
  }

  sayHi() {
    console.log(`Hello, ${this.name}!`)
  }

  sayBye() {
    console.log(`Bye, ${this.name}!`)
  }
}
