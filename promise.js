const PENDING = 'PENDING',
      FULFILLED = 'FULFILLED',
      REJECTED = 'REJECTED';
function Promise(fn) {
    this.status = PENDING
    this.value = null
    this.deffered = []
    fn(resolve.bind(this), reject.bind(this))

    function resolve(value) {
        this.status = FULFILLED
        this.value = value
        this.done()
    }

    function reject(error) {
        this.status = REJECTED
        this.value = error
        this.done()
    }
}

Promise.prototype = {
    constructor: Promise,
    done: function() {
        this.deffered.forEach(task => this.handler(task));
    },
    handler: function(task) {
        let status = this.status 
        let value = this.value
        let p
        switch (status) {
            case FULFILLED:
                p = task.onfulfilled(value)
                break;
            case REJECTED:
                p = task.onrejeted(value)
                break;
        }
        if(p && p.constructor === Promise) {
            p.deffered = task.promise.deffered;
        }
    },
    then: function(onfulfilled, onrejeted) {
        let obj = {
            onfulfilled,
            onrejeted
        }
        obj.promise = new this.constructor(function() {})
        if(this.status === PENDING) {
            this.deffered.push(obj)
        }
        return obj.promise
    }
}