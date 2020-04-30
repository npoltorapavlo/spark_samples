class Math2Impl {
  static min(n, ...args) {
    for (let arg of args) if (arg < n) n = arg
    return n
  }

  static max(n, ...args) {
    for (let arg of args) if (arg > n) n = arg
    return n
  }

  static abs(n) {
    return n < 0 ? -1 * n : n
  }

  static floor(n) {
    return 0 | n
  }

  static round(n) {
    return 0 | (n + 0.5)
  }

  static ceil(n) {
    return 0 | (n + (n !== ~~n))
  }
}

let Math2 = Math2Impl

// let Math2 = new Proxy(
//   {},
//   {
//     get: (target, prop) => {
//       return Math2Impl[prop] || Math[prop]
//     },
//   }
// )

let testCompliance = () => {
  let test = (fn, ...args) => {
    console.assert(Math[fn](...args) === Math2[fn](...args), `${fn} ${args}`)
  }

  let fns = ['min', 'max']
  let ns = [0, 2.346, 5.546, 1, 6, 6.0000123, -2.346, -5.546, -1, -6, -6.0000123]
  fns.forEach((fn) => {
    test.apply(null, [fn].concat(ns))
  })

  fns = ['abs', 'floor', 'round', 'ceil']
  ns = [0, 0.00013214, 1, 1.0020324, 1.657568, 2, 567.1256]
  fns.forEach((fn) => {
    ns.forEach((n) => {
      test(fn, n)
      test(fn, -n)
    })
  })
}

testCompliance()

let testStress = (iter) => {
  let test = (fn, ...args) => {
    let testName = `${iter} x Math.${fn}`
    console.time(testName)
    for (let i = 0; i < iter; ++i) Math[fn](...args)
    console.timeEnd(testName)

    testName = `${iter} x Math2.${fn}`
    console.time(testName)
    for (let i = 0; i < iter; ++i) Math2[fn](...args)
    console.timeEnd(testName)
  }

  let fns = ['min', 'max']
  let ns = [2, 1]
  fns.forEach((fn) => {
    test.apply(null, [fn].concat(ns))
  })

  fns = ['abs', 'floor', 'round', 'ceil']
  ns = [1.657568]
  fns.forEach((fn) => {
    ns.forEach((n) => {
      test(fn, n)
    })
  })
}

testStress(100000000)
