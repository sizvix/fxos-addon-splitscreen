(function(){
var app1 = null;
var app2 = null;
var histo = [] ;
var homescreen;
var cslpre = '-!-';
var homming = false ;
var split_enable = false ;

function going_home(){
    if(homming) return true ;
    else{
        setTimeout(function(){homming=false},300);
        return false;
    }
}

SplitScreen = typeof SplitScreen === 'undefined' ? {
    originalResize: null,
    date: new Date()
} : SplitScreen;
console.log('**********************************\nSplit screen addon loaded\n' + SplitScreen.date + '\n**********************************');

function toggle_enable_split(btn){ 
    if(!split_enable){
        split_enable = true ;
        btn.setAttribute("data-enabled",true) ;
        console.log('on active l\'addon');
        initialize(); 
    }else{
        split_enable=false;
        btn.removeAttribute("data-enabled") ;
        console.log('addon désactivé');
        show1(app2!=null?app2:app1);
        deactiveAddon();
    	for(var lay of document.querySelectorAll('#windows .appWindow')){
            if(app1.id==lay.id) continue ;
            resize1(lay);
            lay.querySelector('.fade-overlay').removeAttribute("style");
            lay.querySelector('iframe').removeAttribute("style");
            lay.style.height = null;
            lay.style.transform = null;
    	}
    }
}


function resizeAll(size){
    console.log(document.querySelectorAll('#windows .appWindow'));
    for(var lay of document.querySelectorAll('#windows .appWindow'))
        if(lay.id=="homescreen") continue ;
	    else if(size==1)		resize1(lay);
    	else			resize2(lay,0);								// if size==undefined too
    console.log('on a retaillé tout');
}
/*	part need to be 0 or 1 */
function resize2(elem,part){
    console.log('resize 2 ',elem.id);
    if(part==undefined) part=0 ;
    elem.style.height = '50%';
//    elem.style.transform = 'translate(0,'+(100*part)+'%';
}
function resize1(elem){
    elem.style.height = '100%';
    elem.style.transform = 'translate(0,0)';
}


function mk_quick_set_btn(action){
    console.log('creation du bouton');
	var li = document.createElement('li');
	var btn = document.createElement('a');
	btn.id = 'quick-settings-splitsreen';
//	btn.text = 'SPLIT';
    var div1 = document.createElement('div');
    div1.classList.add('split_icon_p1') ;
    btn.appendChild(div1);
    var div2 = document.createElement('div');
    div2.classList.add('split_icon_p2') ;
    btn.appendChild(div2);
	btn.classList.add('icon');
	btn.classList.add('bb-button');
	btn.setAttribute('role', 'button');
	btn.setAttribute('aria-hidden', 'true');
	btn.href = '#';
	li.appendChild(btn);
	btn.onclick = function(event){event.stopPropagation(); action(btn)} ;
	div1.onclick = function(event){event.stopPropagation(); action(btn)} ;
	div2.onclick = function(event){event.stopPropagation(); action(btn)} ;
    document.querySelector('#quick-settings ul').appendChild(li);
    console.log('bouton créé');
    
}


const listeners = {
    load: {
        event: 'DOMContentLoaded',
        callback: function(event) {
            console.log(toggle_enable_split);
            mk_quick_set_btn(toggle_enable_split);
        }
    },					
    appresize: {
        event: 'appresize',
        callback: function(event) {
            var appWindow = event.detail;
            console.log('appresize');
            console.log("on va gen_split", appWindow);
            gen_split(appWindow);
            console.log(appWindow.element.style);
        }
    },
    enabledstatechange: {
        event: 'enabledstatechange',
        callback: function(event) {
            var app = event.application;
            if (app.manifestURL === 'app://fb7f8e93-a39a-490a-aeee-e6014509e060/manifest.webapp') {
                if (app.enabled) {
                    console.log('Split screen enabled');
                } else {
    				delete window.SplitScreen;
                    deactiveAddon();
                    console.log('Split screen disabled');
                }
            }
        }
    },
    locationchange: {
        event: '_locationchange',//
        callback: function(event) {
            console.log(cslpre + ' on a locationchange',event);

        }
    },
    appclosed: {
        event: 'appclosed',//
        callback: function(event) {
            console.log(cslpre + ' on a appclosed',event);
/*            if(going_home()) return ;									// if we are going home, don't do it again
            if (app2==null || app1==null)
                show1(null);
            else
                show2(app2, null);*/

        }
    }
};

function gen_split(appWindow) {
    if (appWindow.element.id!="homescreen") {
        console.log(cslpre + ' on est pas dans le homescreen');
        let active = appWindow.element;// document.querySelector('#windows .active');
        if (app1 == null) {
            console.log(cslpre + ' on a pas encore une app');
            show2(active, null);
        } else {
            console.log(cslpre + ' on a déjà une app ('+app1.id+'=='+active.id+')');
            if(app1.id==active.id){
            	console.log(cslpre + ' on a déjà une app et (app2!= null) : '+(app2!= null?'true':'false'));
                if(app2!= null)
                    show2(app2,app1);
                else
                    show2(app1,null);
	    }else{
            	console.log(cslpre + ' on a déjà une app et  (app2.id==active.id || app2.id=="homescreen") : '+(app2==null || app2.id==active.id || app2.id=="homescreen"?'true':'false'));
             	if(app2==null || app2.id==active.id || app2.id=="homescreen")
            		show2(app1, active);
                else
                    show2(app2,active);
            }
        }
    } else {
        console.log(cslpre + ' on retourne sur le home et (app2.id=="homescreen") : '+(app2.id=="homescreen"));
        if(going_home()) return ;									// if we are going home, don't do it again
        if(app2.id=="homescreen")
            show1(null);
        else
            show2(app2,active);
    }
    console.log(cslpre + ' on a retaillé');
}

function clean_hiden(first, second){
   if(app1!=null && (first==null || app1.id!=first.id) &&  (second==null || app1.id!=second.id)){
            app1.querySelector('.fade-overlay').removeAttribute("style");
            app2.querySelector('iframe').removeAttribute("style");
            if(first.classList.contains('active')){
                first.classList.remove('active');
                first.classList.add('inactive');
            }
	}
   if(app2!=null && (first==null || app2.id!=first.id) &&  (second==null || app2.id!=second.id)){
            app2.querySelector('.fade-overlay').removeAttribute("style");
            app2.querySelector('iframe').removeAttribute("style");
	}
}
    
function show2(first, second) {
    clean_hiden(first,second);
    app1 = first;
    if (first == null)
        first = homescreen;
    app2 = second;
    if (second == null)
        second = homescreen;
    console.log(cslpre + ' on va modif les css vers 2');
    if(first.classList.contains('inactive')){
        first.classList.remove('inactive');
        first.classList.add('active');
    }
    first.style.height = '50%';
    first.querySelector('.fade-overlay').style.display = 'none';
    first.querySelector('iframe').style.visibility = 'visible';
    first.style.transform = 'translate(0,0)';
    if(second.classList.contains('inactive')){
        second.classList.remove('inactive');
        second.classList.add('active');
    }
    second.style.height = '50%';
    second.style.transform = 'translate(0,100%)';
    second.querySelector('.fade-overlay').style.display = 'none';
    second.querySelector('iframe').style.visibility = 'visible';
//    if(second.querySelector('.spltscrn_btn_up')==null)
//    	add_btn_switch(second);
}

function add_btn_switch(second){
    var titlebar = second.querySelector('.controls');
    var icon_u = document.createElement('p');
    icon_u.textContent = ' HAUT ' ;
    icon_u.classList.add('spltscrn_btn_up');
    titlebar.appendChild(icon_u);
    icon_u.onclick = function(){console.log('!!!! haut !!!!')};
    var icon_b = document.createElement('p');
    icon_b.textContent = ' BAS ' ;
    icon_b.classList.add('spltscrn_btn_bottom');
    titlebar.appendChild(icon_b);
    icon_b.onclick = function(){console.log('!!!! bas !!!!')};
}

function show1(first) {
    app1 = first;
    if (first == null)
        first = homescreen;
    app2 = null;
    console.log(cslpre + ' on va modif les css vers 1');
    first.style.transform = 'translate(0,0)';
    first.style.height = '100%';
    first.querySelector('.fade-overlay').style.display = 'none';
    first.querySelector('iframe').style.visibility = 'visible';
}


// Main
//removeAddon(); // for testing - Ensures that previous deployed addons are removed

if (document.readyState === 'complete') {
    console.log('document state is complete');
//    initialize();
    listeners.load.callback();
} else {
    console.log('document is not ready');
    window.addEventListener(listeners.load.event, listeners.load.callback);
}

function initialize(){
    homescreen = document.querySelector('#homescreen');
    console.log('on va les retailler tous');
    resizeAll();
    if(!homescreen.classList.contains('active')){
        console.log(cslpre+' homescreen pas actif !!!!!');
        var active = document.querySelector('#windows .active');
        show2(active,null);
    }
    
    console.log('on va mettre les events');
    window.addEventListener(listeners.appresize.event, listeners.appresize.callback);
    window.addEventListener(listeners.locationchange.event, listeners.locationchange.callback);
    window.addEventListener(listeners.appclosed.event, listeners.appclosed.callback);
    navigator.mozApps.mgmt.addEventListener('enabledstatechange', listeners.enabledstatechange.callback);

    bodiv_text('Addon enabled');
}


function deactiveAddon() {
    for (key in listeners) {
        if (listeners.hasOwnProperty(key)) {
            let listener = listeners[key];
            console.log('clean listener on ' + listener.event);
            window.removeEventListener(listener.event, listener.callback);
        }
    }
}
}() );

function bodiv_text(text){
    if (document.querySelector('.fxos-banner')) {
        // Already injected, abort.
     //   return;
    } else {
        var body = document.querySelector('body');
        var fxosBanner = document.createElement('div');
        fxosBanner.classList.add('fxos-banner');
        var bannerText = document.createElement('p');
        var closeBtn = document.createElement('button');

        fxosBanner.appendChild(bannerText);
        fxosBanner.appendChild(closeBtn);
        body.appendChild(fxosBanner);

        closeBtn.textContent = 'X';
        bannerText.textContent = text;

        closeBtn.onclick = function() {
            fxosBanner.parentNode.removeChild(fxosBanner);
        }
    }
}

bodiv_text('Addon installed')

console.log("syntax ok");