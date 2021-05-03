class Vue{
    constructor(options){
        this.$options = options;
        this.$methods = options.methods;
        this.$data = options.data;
        this.$el = typeof options.el === "string"?window.document.querySelector(options.el):options.el
        
        this.proxyData();
        this.compile();
    }

    proxyData(){
        let data = this.$data;
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this,key,{
                get:function(){
                    return data[key];
                },
                set:function(val){
                    data[key] = val;
                }
            });
        })
    }

    compile(){
        new Compile(this.$el,this);
    }



}
