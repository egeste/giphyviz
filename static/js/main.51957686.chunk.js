(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{169:function(e,t,n){e.exports=n(345)},333:function(e,t,n){},345:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),i=n(13),o=n.n(i),c=n(58),l=n(168),u=n(30),s=n(31),h=n(34),d=n(32),p=n(35),m=n(153),g=n.n(m),y=n(154),f=n.n(y),E=n(155),b=n.n(E),v=n(108),j=n.n(v),A=n(110),O=n(352),C=n(347),P=n(348),S=n(166),w=n(353),G=n(351),q=n(349),F=n(350),x=n(109),D=n(167),V=n(160),k=n.n(V),U=n(43),I=(a.PureComponent,n(161)),B=n.n(I),M=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(n=Object(h.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(r)))).state={playing:!1},n.onAudioFrame=function(){if(n.state.playing&&n.audioAnalyser){var e=new Uint8Array(n.audioAnalyser.frequencyBinCount);n.audioAnalyser.getByteFrequencyData(e),n.props.onFrequencyData(e),requestAnimationFrame(n.onAudioFrame)}},n.onAudioPlayerRef=function(e){if(e&&e.audioEl){e.audioEl.crossOrigin="anonymous";var t=new AudioContext,a=t.createMediaElementSource(e.audioEl);n.audioAnalyser=t.createAnalyser(),a.connect(n.audioAnalyser),a.connect(t.destination)}},n.onUpdatePlaying=function(e,t){return function(){var a=n.state.playing,r=e;if(n.setState({playing:e}),!a&&r&&n.onAudioFrame(),"function"===typeof t)return t.apply(void 0,arguments)}},n}return Object(p.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement(B.a,Object.assign({controls:!0},this.props,{ref:this.onAudioPlayerRef,onAbort:this.onUpdatePlaying(!1,this.props.onAbort),onEnded:this.onUpdatePlaying(!1,this.props.onEnded),onPause:this.onUpdatePlaying(!1,this.props.onPause),onPlay:this.onUpdatePlaying(!0,this.props.onPlay)}))}}]),t}(a.PureComponent),T=function(e){function t(){var e,n;Object(u.a)(this,t);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(n=Object(h.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(r)))).state={frequencyData:[]},n.onFrequencyData=function(e){return n.setState({frequencyData:e})},n}return Object(p.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement(a.Fragment,null,r.a.createElement(M,Object.assign({},this.props,{onFrequencyData:this.onFrequencyData})),this.props.renderFrequencyData(Object(c.a)(this.state.frequencyData)))}}]),t}(a.PureComponent),z=(n(333),n(334),{api_key:"jjIUQzslADPjJkPXJdmHrkqvGER7KVwV"}),J=(Object(A.a)().domain([0,255]).range([5,0]),function(e){function t(){var e,n;Object(u.a)(this,t);for(var i=arguments.length,o=new Array(i),s=0;s<i;s++)o[s]=arguments[s];return(n=Object(h.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={mp3:"http://51.15.76.3:80/pulstranceHD.mp3",gifs:[],term:"acid",freqs:[],gifCount:20,loadingMusic:!1,loadingVideos:!1,searchingGiphy:!1,differenceIndex:[]},n.componentDidMount=function(){n.onSearchGiphy()},n.onChangeSearch=function(e){var t=e.target;n.setState({term:t.value},n.onSearchGiphy)},n.onChangeGifCount=function(e){n.setState({gifCount:e},n.onSearchGiphy)},n.onChangeMP3=j()(function(e){var t=e.target;n.setState({mp3:t.value})},1e3),n.onSearchGiphy=j()(function(){n.setState({searchingGiphy:!0});var e=Object(l.a)({},z,{q:n.state.term,limit:n.state.gifCount});return f()("https://api.giphy.com/v1/gifs/search?".concat(g.a.stringify(e))).then(function(e){return e.json()}).then(function(e){var t=e.data;return n.setState({gifs:t,searchingGiphy:!1},n.onPreloadVideos)}).catch(function(){return n.setState({searchingGiphy:!1})})},1e3),n.onPreloadVideos=function(){return n.setState({loadingVideos:!0}),Promise.all(n.state.gifs.map(function(e){return new Promise(function(t,n){var a=new window.Image;a.src="".concat(e.images.original.url),a.onload=function(){return t()},a.onerror=function(){return n()}})})).then(function(){return n.setState({loadingVideos:!1})}).catch(function(){return n.setState({loadingVideos:!1})})},n.renderFrequencyData=function(e){var t=!n.state.searchingGiphy&&!n.state.loadingVideos&&n.state.gifs.length,i=b()(e,10).reduce(function(e,t){var n=t.reduce(function(e,t){return e+t},0);return[].concat(Object(c.a)(e),[n])},[]),o=(i.reduce(function(e,t){return e+t},0),i.length,Object(c.a)(i).sort().reverse()[0]),l=i.indexOf(o);console.log({highestAmplitude:o,highestAmplitudeIndex:l});var u=i.map(function(e,t){return{x:t,y:e,colorType:"literal",color:t===l?"green":"purple"}});return r.a.createElement("div",{style:{position:"relative"}},r.a.createElement(x.a,{height:100},r.a.createElement(x.b,{colorType:"literal",data:u})),t?function(){var e=Object(A.b)().domain([0,i.length]).range(n.state.gifs)(l);return r.a.createElement(a.Fragment,null,r.a.createElement("img",{src:"".concat(e.images.original.url),style:{position:"absolute",width:"100%",height:"60vh",zIndex:-1,objectFit:"fill"}}))}():null)},n}return Object(p.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement(a.Fragment,null,r.a.createElement(O.a,{bg:"dark",variant:"dark",expand:"sm"},r.a.createElement(O.a.Brand,{to:"/",children:"giphyviz"}),r.a.createElement(O.a.Toggle,null)),r.a.createElement(C.a,null,r.a.createElement(P.a,null,r.a.createElement(S.a,{xs:3},r.a.createElement(w.a,null,r.a.createElement(w.a.Body,null,r.a.createElement(G.a.Group,null,r.a.createElement(G.a.Label,{children:"Audio Source"}),r.a.createElement(G.a.Control,{type:"text",value:this.state.mp3,placeholder:"http://someurl.com/file.mp3",onChange:this.onChangeMP3})),r.a.createElement(G.a.Group,null,r.a.createElement(G.a.Label,{children:"Giphy Search Term"}),r.a.createElement(q.a,null,r.a.createElement(G.a.Control,{type:"text",value:this.state.term,placeholder:"Search",onChange:this.onChangeSearch}),this.state.searchingGiphy?r.a.createElement(q.a.Append,null,r.a.createElement(q.a.Text,null,r.a.createElement(F.a,{animation:"border",size:"sm"}))):null)),r.a.createElement(G.a.Group,null,r.a.createElement(G.a.Label,{children:"Number of gifs"}),r.a.createElement(q.a,null,r.a.createElement(D.a,{defaultValue:this.state.gifCount,onChange:this.onChangeGifCount})))))),r.a.createElement(S.a,{xs:9},r.a.createElement(T,{autoPlay:!0,src:this.state.mp3,style:{width:"100%"},renderFrequencyData:this.renderFrequencyData}),this.state.searchingGiphy?r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement(F.a,{animation:"grow"}),r.a.createElement("p",{children:"Searching giphy..."})):this.state.loadingVideos?r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement(F.a,{animation:"grow"}),r.a.createElement("p",{children:"Loading ".concat(this.state.gifCount," giphy results...")})):null))))}}]),t}(a.PureComponent));o.a.render(r.a.createElement(J,null),document.getElementById("root"))}},[[169,1,2]]]);
//# sourceMappingURL=main.51957686.chunk.js.map