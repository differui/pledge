const STATUS_PENDING = 'pending'
const STATUS_FULFILL = 'fulfill'
const STATUS_REJECT = 'reject'

function addTaskToQ(task) {
  setTimeout(task, 0)
}

function isThenable(o) {
  return typeof o === 'object' && o !== null && 'then' in o
}

class Pledge {
  constructor() {
    this.result = undefined
    this.status = STATUS_PENDING
    this.fulfillQ = []
    this.rejectQ = []
  }
  then(onFulfilled = (v => v), onRejected = (v => v)) {
    const returnValue = new Pledge()
    const fulfillTask = () => {
      try {
        returnValue.resolve(onFulfilled(this.result))
      } catch(e) {
        returnValue.reject(e)
      }
    }
    const rejectTask = () => {
      try {
        returnValue.resolve(onRejected(this.result))
      } catch(e) {
        returnValue.reject(e)
      }
    }

    switch (this.status) {
      case STATUS_PENDING:
        this.fulfillQ.push(fulfillTask)
        this.rejectQ.push(rejectTask)
        break
      case STATUS_FULFILL:
        addTaskToQ(fulfillTask)
        break
      case STATUS_REJECT:
        addTaskToQ(rejectTask)
        break
    }
    return returnValue
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  resolve(value) {
    if (this.status !== STATUS_PENDING) return
    if (isThenable(value)) {
      value.then(
        (v => this.resolve(v)),
        (v => this.reject(v))
      )
    } else {
      this.result = value
      this.status = STATUS_FULFILL
      this._depleteQ(this.fulfillQ)
    }
    return this
  }
  reject(value) {
    if (this.status !== STATUS_PENDING) return
    this.result = value
    this.status = STATUS_REJECT
    this._depleteQ(this.rejectQ)
    return this
  }
  _depleteQ(Q) {
    for (let t of Q) t()
    this.fulfillQ.length = 0
    this.rejectQ.length = 0
  }
}

Pledge.PENDING = STATUS_PENDING
Pledge.FULFILL = STATUS_FULFILL
Pledge.REJECT = STATUS_REJECT

export default Pledge
