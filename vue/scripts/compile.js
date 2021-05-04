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
        this.Fragment2Vnode(fragment);
        el.appendChild(fragment);
    }

    Fragment2Vnode(fragment){
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach((node)=>{
            if(this.isInterpolation(node)){
                this.compileText(node);
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

    update(node,context,exp,dir){
        const updateFn = this[dir+"Updater"];
        updateFn && updateFn(node,context[exp]);

        new Watcher(context,exp,function(value){
            updateFn && updateFn(node,value);
        })
    }

    
    html(node,context,exp){
        this.update(node,context,exp,"html");
    }

    htmlUpdater(node,value){
        node.innerHTML = value;
    }

    compileText(node){
        this.update(node,this.$vm,RegExp.$1,"text");
    }

    text(node,context,exp){
        this.update(node,context,exp,"text");
    }

    textUpdater(node,value){
        node.textContent = value;
    }

    model(node,context,exp){
        this.update(node,context,exp,"model");

        node.addEventListener("input",function(e){
            context[exp] = e.target.value
        })
    }

    modelUpdater(node,value){
        node.value = value;
    }

    if(node,context,exp){
        const clone = node.cloneNode(true);
        let comment = document.createComment(`This is v-if tag`);
        let parentNode = node.parentNode;
        if(parentNode){
            parentNode.replaceChild(comment,node);
        }
        let value = context[exp];
        let frag ;
        if(value){
            frag=clone.cloneNode(true);
            parentNode.insertBefore(frag,comment);
        }

        new Watcher(context,exp,function(value){
            if(!value){
                frag && frag.remove();
            }else{
                let parentNode = comment.parentNode;
                frag=clone.cloneNode(true);
                parentNode.insertBefore(frag,comment);
            }
        })
    }

    show(node,context,exp){
        const orignalDisplay = window.getComputedStyle(node,null).display;

        let value = context[exp];
        if(!value){
            node.style.display = "none"
        }

        new Watcher(context,exp,function(value){
            if(!value){
                node.style.display = "none"
            }else{
                node.style.display = orignalDisplay;
            }
        })

    }

}