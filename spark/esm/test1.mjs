import User from './test2.mjs'
let user = new User('John')
user.sayHi()
user.sayBye()

import { sayHi, sayBye } from './test3.mjs'
sayHi('John')
sayBye('John')

import * as say from './test3.mjs'
say.sayHi('John')
say.sayBye('John')
