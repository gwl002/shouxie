class Vue{
    constructor(options){
        this.$options = options;
        this.$methods = options.methods;
        this.$data = options.data;
        this.$el = typeof options.el === "string"?window.document.querySelector(options.el):options.el

        this.observe(this.$data);
        
        this.compile();
    }

    observe(obj){
        if(!obj || typeof obj !== "object"){
            return;
        }
        Object.keys(obj).forEach(key => {
            this.defineReactive(obj,key,obj[key])
            this.proxyData(key);
        })
    }

    defineReactive(obj,key,val){
        this.observe(val);
        const dep = new Dep();
        Object.defineProperty(obj,key,{
            get(){
                Dep.target && dep.addDep(Dep.target)
                return val
            },
            set(newVal){
                if(val===newVal) return;
                val = newVal;
                dep.notify();
            }
        })
    }

    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key]
            },
            set(val){
                this.$data[key] = val;
            }
        })

    }

    compile(){
        new Compile(this.$el,this);
    }

}

class Dep{
    constructor(){
        this.deps = []
    }

    addDep(dep){
        this.deps.push(dep)
    }

    notify(){
        this.deps.forEach(dep=>{
            dep.update()
        })
    }
}


class Watcher{
    static count = 0;
    constructor(vm,key,cb){
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        Dep.target = this;
        this.vm[this.key];
        Dep.target = null;
        Watcher.count ++;
    }

    update(){
        this.cb.call(this.vm,this.vm[this.key])
    }
}


