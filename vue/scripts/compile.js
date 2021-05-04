class Compile{
    constructor(el,vm){
        this.$el = el;
        this.$vm = vm;
        this.compile();
    }

    compile(){
        let el = this.$el;
        if(!el){
            throw new Error("element is not found");
            return;
        }
        let fragment = document.createDocumentFragment();
        let child;
        while( child = el.firstElementChild){
            fragment.appendChild(child);
        }
        this.Fragment2Vnode(fragment)
        el.appendChild(fragment);
    }

    Fragment2Vnode(fragment){
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach((node)=>{
            if(this.isInterpolation(node)){
                let key = RegExp.$1;
                node.textContent = this.$vm[key];
            }else if(this.isElement(node)){
                let attrs = node.attributes;
                Array.from(attrs).forEach(attr=>{
                    let attrName = attr.name;
                    let exp = attr.value;
                    if(this.isDirective(attrName)){
                        const dir = attrName.substring(2);
                        this[dir] && this[dir](node,this.$vm,exp);
                    }else if(this.isEvent(attrName)){
                        const eventName = attrName.substring(1);
                        this.eventHandler(node,this.$vm,exp,eventName);
                    }
                })
            }
            if(node.childNodes&&node.childNodes.length>0 ){
                this.Fragment2Vnode(node);
            }
        })
    }

    isDirective(attr) {
        return attr.indexOf("v-") == 0;
    }

    isEvent(attr) {
        return attr.indexOf("@") == 0;
    }

    isElement(node) {
        return node.nodeType === 1;
    }
    // 插值文本
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    eventHandler(node,context,methodName,eventName){
        let fn = context.$options.methods && context.$options.methods[methodName];
        if(eventName && fn){
            node.addEventListener(eventName, fn.bind(context));
        }
    }

    text(node,context,exp){
        node.textContent = context[exp];
    }

    model(node,context,exp){
        node.value = context[exp];
        node.addEventListener("input",function(e){
            context[exp] = e.target.value
        })
    }

}