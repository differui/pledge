import test from 'ava'
import Pledge from '../'

test('basic', t => {
  const p = new Pledge()

  t.plan(1)
  p.then((v) => t.is(v, 'test'))
  p.resolve('test')
})

test('chain', t => {
    const p = new Pledge()

    t.plan(3)
    p
    .then(v => {
      t.is(v, 1)
      return 2
    })
    .then(v => {
      t.is(v, 2)
      return 3
    })
    .then(v => {
      t.is(v, 3)
    })
    p.resolve(1)
})

test('flatten', t => {
  const p1 = new Pledge()
  const p2 = new Pledge()

  t.plan(1)
  p1
  .then(() => p2)
  .then(v => t.is(v, 'test'))
  p1.resolve()
  p2.resolve('test')
})

test('exception', t => {
  const p = new Pledge()

  t.plan(1)
  p
  .then(() => {
    throw 'test'
  })
  .catch(e => {
    t.is(e, 'test')
  })
  p.resolve()
})
