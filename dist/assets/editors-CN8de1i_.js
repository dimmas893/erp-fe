import{u as m,S as g,P as v,U as k,E as b}from"./index-CW3BbK-I.js";import{T as h}from"./index-BZk9Exf_.js";import{V as n}from"./VChip-FseWGz3T.js";import{V as C}from"./VDivider-D7iOkos2.js";import{c as u,o as s,l as y,b as i,m as t,e as r,t as a,r as $,aX as _,f as A}from"./index-oM6dt0nl.js";import{_ as x}from"./AppCardCode-CjFvjsk9.js";import{_ as E}from"./TiptapEditor-CQpDp5Rn.js";import{V as B,a as f}from"./VRow-DUBqKGkl.js";import"./VSlideGroup-Bm28qC-v.js";import"./VAvatar-B-sFcdAe.js";import"./VImg-CbCuusDt.js";import"./vue3-perfect-scrollbar-QmlUH9_e.js";import"./VCard-FM1MZCfp.js";import"./VCardText-ByzvGG12.js";/* empty css              */const V={class:"border pa-2 rounded custom-editor"},w={key:0,class:"d-flex flex-wrap gap-x-4 gap-y-2 mb-2"},H={__name:"DemoEditorCustomEditor",setup(c){const o=m({content:`
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That's a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that's amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,extensions:[g,h.configure({types:["heading","paragraph"]}),v.configure({placeholder:"Write something here..."}),k]});return(p,e)=>(s(),u("div",V,[t(o)?(s(),u("div",w,[i(n,{disabled:!t(o).can().chain().focus().toggleBold().run(),color:t(o).isActive("bold")?"primary":"",onClick:e[0]||(e[0]=l=>t(o).chain().focus().toggleBold().run())},{default:r(()=>[a(" bold ")]),_:1},8,["disabled","color"]),i(n,{disabled:!t(o).can().chain().focus().toggleItalic().run(),color:t(o).isActive("italic")?"primary":"",onClick:e[1]||(e[1]=l=>t(o).chain().focus().toggleItalic().run())},{default:r(()=>[a(" italic ")]),_:1},8,["disabled","color"]),i(n,{disabled:!t(o).can().chain().focus().toggleStrike().run(),color:t(o).isActive("strike")?"primary":"",onClick:e[2]||(e[2]=l=>t(o).chain().focus().toggleStrike().run())},{default:r(()=>[a(" strike ")]),_:1},8,["disabled","color"]),i(n,{disabled:!t(o).can().chain().focus().toggleCode().run(),color:t(o).isActive("code")?"primary":"",onClick:e[3]||(e[3]=l=>t(o).chain().focus().toggleCode().run())},{default:r(()=>[a(" code ")]),_:1},8,["disabled","color"]),i(n,{onClick:e[4]||(e[4]=l=>t(o).chain().focus().unsetAllMarks().run())},{default:r(()=>[a(" clear marks ")]),_:1}),i(n,{onClick:e[5]||(e[5]=l=>t(o).chain().focus().clearNodes().run())},{default:r(()=>[a(" clear nodes ")]),_:1}),i(n,{color:t(o).isActive("paragraph")?"primary":"",onClick:e[6]||(e[6]=l=>t(o).chain().focus().setParagraph().run())},{default:r(()=>[a(" paragraph ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("heading",{level:1})?"primary":"",onClick:e[7]||(e[7]=l=>t(o).chain().focus().toggleHeading({level:1}).run())},{default:r(()=>[a(" h1 ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("heading",{level:2})?"primary":"",onClick:e[8]||(e[8]=l=>t(o).chain().focus().toggleHeading({level:2}).run())},{default:r(()=>[a(" h2 ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("heading",{level:3})?"primary":"",onClick:e[9]||(e[9]=l=>t(o).chain().focus().toggleHeading({level:3}).run())},{default:r(()=>[a(" h3 ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("heading",{level:4})?"primary":"",onClick:e[10]||(e[10]=l=>t(o).chain().focus().toggleHeading({level:4}).run())},{default:r(()=>[a(" h4 ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("heading",{level:5})?"primary":"",onClick:e[11]||(e[11]=l=>t(o).chain().focus().toggleHeading({level:5}).run())},{default:r(()=>[a(" h5 ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("heading",{level:6})?"primary":"",onClick:e[12]||(e[12]=l=>t(o).chain().focus().toggleHeading({level:6}).run())},{default:r(()=>[a(" h6 ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("bulletList")?"primary":"",onClick:e[13]||(e[13]=l=>t(o).chain().focus().toggleBulletList().run())},{default:r(()=>[a(" bullet list ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("orderedList")?"primary":"",onClick:e[14]||(e[14]=l=>t(o).chain().focus().toggleOrderedList().run())},{default:r(()=>[a(" ordered list ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("codeBlock")?"primary":"",onClick:e[15]||(e[15]=l=>t(o).chain().focus().toggleCodeBlock().run())},{default:r(()=>[a(" code block ")]),_:1},8,["color"]),i(n,{color:t(o).isActive("blockquote")?"primary":"",onClick:e[16]||(e[16]=l=>t(o).chain().focus().toggleBlockquote().run())},{default:r(()=>[a(" blockquote ")]),_:1},8,["color"]),i(n,{onClick:e[17]||(e[17]=l=>t(o).chain().focus().setHorizontalRule().run())},{default:r(()=>[a(" horizontal rule ")]),_:1}),i(n,{onClick:e[18]||(e[18]=l=>t(o).chain().focus().setHardBreak().run())},{default:r(()=>[a(" hard break ")]),_:1}),i(n,{disabled:!t(o).can().chain().focus().undo().run(),onClick:e[19]||(e[19]=l=>t(o).chain().focus().undo().run())},{default:r(()=>[a(" undo ")]),_:1},8,["disabled"]),i(n,{disabled:!t(o).can().chain().focus().redo().run(),onClick:e[20]||(e[20]=l=>t(o).chain().focus().redo().run())},{default:r(()=>[a(" redo ")]),_:1},8,["disabled"])])):y("",!0),i(C,{class:"my-4"}),i(t(b),{editor:t(o)},null,8,["editor"])]))}},I={__name:"DemoEditorBasicEditor",setup(c){const o=$(`
<p>
  This is a radically reduced version of tiptap. It has support for a document, with paragraphs and text. That's it. It's probably too much for real minimalists though.
</p>
<p>
  The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.  
</p>
`);return(p,e)=>{const l=E;return s(),u("div",null,[i(l,{modelValue:t(o),"onUpdate:modelValue":e[0]||(e[0]=d=>_(o)?o.value=d:null),class:"border rounded basic-editor"},null,8,["modelValue"])])}}},T={},q={},F={__name:"editors",setup(c){return(o,p)=>{const e=I,l=x,d=H;return s(),A(B,null,{default:r(()=>[i(f,{cols:"12"},{default:r(()=>[i(l,{title:"Basic Editor",code:T},{default:r(()=>[i(e)]),_:1},8,["code"])]),_:1}),i(f,{cols:"12"},{default:r(()=>[i(l,{title:"Custom Editor",code:q},{default:r(()=>[i(d)]),_:1},8,["code"])]),_:1})]),_:1})}}};export{F as default};
