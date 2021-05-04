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
        Object.defineProperty(obj,key,{
            get(){
                return val
            },
            set(newVal){
                if(val===newVal) return;
                val = newVal;
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

    addDep(){
        
    }

    notify(){

    }
}

class Watcher{

}
